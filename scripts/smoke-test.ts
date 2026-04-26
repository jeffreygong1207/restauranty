import { spawnSync } from "node:child_process";
import { loadEnvConfig } from "@next/env";
import { enforcePolicy } from "@/lib/agents/policyAgent";
import { scoreReservationRisk } from "@/lib/agents/riskAgent";
import { rankWaitlistCandidates } from "@/lib/agents/waitlistAgent";
import { reviewCandidateFairness } from "@/lib/agents/fairnessAgent";
import { ensureIndexes } from "@/lib/db";
import {
  addAuditLog,
  addSponsorEvent,
  getPolicyForRestaurant,
  getRestaurant,
  id,
  isoNow,
  listAuditLogs,
  listDiners,
  listReservations,
  listSponsorEvents,
  listWaitlistCandidates,
  saveRecoveryRequest,
  seedDatabase,
} from "@/lib/repositories/store";
import { getPlaceDetails, searchGooglePlaces } from "@/lib/services/googlePlaces";
import { validateEnvironment } from "@/lib/env";

loadEnvConfig(process.cwd());

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log("1. env loads");
  const env = validateEnvironment();
  assert(env.mode === "atlas-ready" || env.mode === "demo-fallback", "env mode invalid");

  console.log("2. MongoDB connection works if configured");
  await ensureIndexes();

  console.log("3. seed data can be inserted");
  await seedDatabase();

  console.log("4. Google Places search returns Katsuya West Hollywood");
  const places = await searchGooglePlaces({
    query: "Katsuya West Hollywood",
    location: "Los Angeles, CA",
  });
  assert(places.results.length > 0, "no restaurant results");
  const katsuya =
    places.results.find((result) => /katsuya/i.test(result.name)) ?? places.results[0];
  assert(katsuya, "Katsuya not found in results");
  if (places.warning) {
    console.log("   (using fallback Places data:", places.warning, ")");
  }

  console.log("5. Google Places details resolves the same listing");
  const details = await getPlaceDetails(katsuya.googlePlaceId);
  assert(details.result, "place details missing");
  assert(
    details.result?.name && details.result.name.length > 0,
    "place details missing name",
  );

  console.log("6. reservation can be loaded");
  const reservations = await listReservations();
  const reservation = reservations[0];
  assert(reservation, "no reservation");

  console.log("7. risk score is calculated");
  const restaurant = await getRestaurant(reservation.restaurantId);
  const diners = await listDiners();
  const diner = diners.find((item) => item._id === reservation.dinerId);
  const policy = await getPolicyForRestaurant(reservation.restaurantId);
  if (!restaurant || !diner) throw new Error("missing restaurant or diner");
  const risk = scoreReservationRisk({ reservation, restaurant, diner, policy });
  assert(risk.score >= 0 && risk.score <= 100, "risk out of bounds");

  console.log("8. paid resale is blocked by default");
  const policyDecision = await enforcePolicy({ policy, reservation, attemptedTransferFee: 50 });
  assert(policyDecision.paidResaleBlocked, "paid resale was not blocked");

  console.log("9. waitlist candidates are ranked");
  const candidates = await listWaitlistCandidates(reservation.restaurantId);
  const ranked = rankWaitlistCandidates({ reservation, restaurant, policy, candidates, diners });
  assert(ranked.length > 0, "no ranked candidates");

  console.log("10. unverified candidate is blocked when verification required");
  const unverified = ranked.find((candidate) => !candidate.verifiedHuman) ?? ranked[ranked.length - 1];
  const fairness = await reviewCandidateFairness({ candidate: unverified, diner: diners.find((item) => item._id === unverified.dinerId), policy });
  assert(!policy.humanVerificationRequired || fairness.decision === "block" || unverified.verifiedHuman, "unverified candidate was not blocked");

  console.log("11. recovery request can be created");
  await saveRecoveryRequest({
    _id: id("smoke_recovery"),
    reservationId: reservation._id,
    restaurantId: reservation.restaurantId,
    originalDinerId: reservation.dinerId,
    selectedReplacementDinerId: ranked[0].dinerId,
    status: "drafted",
    revenueProtected: reservation.estimatedRevenue,
    feeWaived: false,
    createdAt: isoNow(),
    updatedAt: isoNow(),
  });

  console.log("12. audit logs are written");
  await addAuditLog({
    actorType: "system",
    actorId: "smoke",
    action: "smoke_audit",
    entityType: "reservation",
    entityId: reservation._id,
  });
  assert((await listAuditLogs(reservation._id)).length > 0, "audit log missing");

  console.log("13. sponsor events are written");
  await addSponsorEvent({ sponsor: "cognition", eventType: "smoke_test_passed", payload: { reservationId: reservation._id } });
  assert((await listSponsorEvents()).length > 0, "sponsor event missing");

  console.log("14. app build succeeds");
  const build = spawnSync("npm", ["run", "build"], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production", RESTAURANTY_SMOKE_BUILD: "1" },
  });
  assert(build.status === 0, "next build failed during smoke test");

  console.log("Smoke test passed.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
