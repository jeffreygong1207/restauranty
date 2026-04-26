import { enforcePolicy } from "@/lib/agents/policyAgent";
import { scoreReservationRisk } from "@/lib/agents/riskAgent";
import { rankWaitlistCandidates } from "@/lib/agents/waitlistAgent";
import { reviewCandidateFairness } from "@/lib/agents/fairnessAgent";
import { integrationStatus } from "@/lib/env";
import {
  getDiner,
  getPolicyForRestaurant,
  getRecoveryRequestByReservation,
  getReservation,
  getRestaurant,
  listAgentLogs,
  listAgentRuns,
  listAuditLogs,
  listDiners,
  listPolicies,
  listReservations,
  listRestaurants,
  listSponsorEvents,
  listWaitlistCandidates,
} from "@/lib/repositories/store";
import type { Reservation } from "@/lib/types";

export async function reservationRows() {
  const [reservations, restaurants, diners] = await Promise.all([
    listReservations(),
    listRestaurants(),
    listDiners(),
  ]);
  return reservations.map((reservation) => ({
    reservation,
    restaurant: restaurants.find((item) => item._id === reservation.restaurantId),
    diner: diners.find((item) => item._id === reservation.dinerId),
  }));
}

export async function dashboardData() {
  const [rows, candidates, sponsorEvents] = await Promise.all([
    reservationRows(),
    listWaitlistCandidates(),
    listSponsorEvents(),
  ]);
  const reservations = rows.map((row) => row.reservation);
  const atRisk = reservations.filter((item) => item.riskScore >= 60);
  const recovered = reservations.filter((item) => item.status === "recovered");
  const verifiedCandidates = candidates.filter((item) => item.verifiedHuman);
  const suspiciousBlocked = candidates.filter((item) => item.status === "blocked").length;
  return {
    rows,
    metrics: {
      atRisk: atRisk.length,
      recoveryReadyCovers: candidates.filter((item) => item.status === "available").length,
      revenueAtRisk: atRisk.reduce((sum, item) => sum + item.estimatedRevenue, 0),
      recoveredRevenue: recovered.reduce((sum, item) => sum + item.estimatedRevenue, 0),
      verifiedCandidates: verifiedCandidates.length,
      suspiciousBlocked,
    },
    sponsorEvents,
    integrations: integrationStatus(),
  };
}

export async function reservationDetailData(id?: string) {
  let reservation: Reservation | null = null;
  if (id) {
    reservation = await getReservation(id);
  } else {
    const reservations = await listReservations();
    reservation = reservations[0] ?? null;
  }
  if (!reservation) return null;
  const [restaurant, diner, policy, auditLogs, agentLogs, agentRuns] = await Promise.all([
    getRestaurant(reservation.restaurantId),
    getDiner(reservation.dinerId),
    getPolicyForRestaurant(reservation.restaurantId),
    listAuditLogs(reservation._id),
    listAgentLogs(reservation._id),
    listAgentRuns(reservation._id),
  ]);
  if (!restaurant || !diner) return null;
  const risk = scoreReservationRisk({ reservation, restaurant, diner, policy });
  return { reservation, restaurant, diner, policy, risk, auditLogs, agentLogs, agentRuns };
}

export async function recoveryDetailData(id?: string) {
  const detail = await reservationDetailData(id);
  if (!detail) return null;
  const [candidates, diners, recoveryRequest] = await Promise.all([
    listWaitlistCandidates(detail.restaurant._id),
    listDiners(),
    getRecoveryRequestByReservation(detail.reservation._id),
  ]);
  const policyDecision = await enforcePolicy({
    policy: detail.policy,
    reservation: detail.reservation,
  });
  const rankedCandidates = rankWaitlistCandidates({
    reservation: detail.reservation,
    restaurant: detail.restaurant,
    policy: detail.policy,
    candidates,
    diners,
  });
  const fairnessReviews = await Promise.all(
    rankedCandidates.map((candidate) =>
      reviewCandidateFairness({
        candidate,
        diner: diners.find((diner) => diner._id === candidate.dinerId),
        policy: detail.policy,
      }),
    ),
  );
  return {
    ...detail,
    diners,
    candidates,
    rankedCandidates,
    fairnessReviews,
    policyDecision,
    recoveryRequest,
  };
}

export async function adminData() {
  const [auditLogs, sponsorEvents, agentRuns, agentLogs] = await Promise.all([
    listAuditLogs(),
    listSponsorEvents(),
    listAgentRuns(),
    listAgentLogs(),
  ]);
  return { auditLogs, sponsorEvents, agentRuns, agentLogs, integrations: integrationStatus() };
}

export async function policyPageData() {
  const [restaurants, policies] = await Promise.all([listRestaurants(), listPolicies()]);
  return { restaurants, policies };
}
