import { handleApiError, ok, readJson } from "@/lib/api";
import { recoveryAgentManifest } from "@/lib/agents/agentverseAdapter";
import { scoreReservationRisk } from "@/lib/agents/riskAgent";
import { rankWaitlistCandidates } from "@/lib/agents/waitlistAgent";
import { enforcePolicy } from "@/lib/agents/policyAgent";
import {
  getDiner,
  getPolicyForRestaurant,
  getReservation,
  getRestaurant,
  listDiners,
  listReservations,
  listWaitlistCandidates,
} from "@/lib/repositories/store";
import { agentChatSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  return ok({ manifest: recoveryAgentManifest() });
}

export async function POST(request: Request) {
  try {
    const input = agentChatSchema.parse(await readJson(request));
    const message = input.message.toLowerCase();
    const reservations = await listReservations();
    const reservation =
      (input.reservationId ? await getReservation(input.reservationId) : null) ??
      reservations.sort((a, b) => b.riskScore - a.riskScore)[0];
    if (!reservation) return ok({ reply: "No reservations are available.", manifest: recoveryAgentManifest() });

    const [restaurant, diner, policy, diners, candidates] = await Promise.all([
      getRestaurant(reservation.restaurantId),
      getDiner(reservation.dinerId),
      getPolicyForRestaurant(reservation.restaurantId),
      listDiners(),
      listWaitlistCandidates(reservation.restaurantId),
    ]);
    if (!restaurant || !diner) return ok({ reply: "Reservation data is incomplete." });
    const risk = scoreReservationRisk({ reservation, diner, restaurant, policy });
    const policyDecision = await enforcePolicy({ reservation, policy });
    const ranked = rankWaitlistCandidates({ reservation, restaurant, policy, candidates, diners });

    let reply = `Reservation ${reservation._id} is ${risk.level} risk at ${risk.score}/100. ${risk.recommendedAction}.`;
    if (message.includes("which") && message.includes("high risk")) {
      reply = reservations
        .filter((item) => item.riskScore >= 60)
        .map((item) => `${item._id}: ${item.riskScore}/100 ${item.recommendedAction}`)
        .join("\n");
    } else if (message.includes("why")) {
      reply = risk.explanation;
    } else if (message.includes("best replacement") || message.includes("who")) {
      const best = ranked[0];
      const bestDiner = diners.find((item) => item._id === best?.dinerId);
      reply = best ? `${bestDiner?.name ?? best.dinerId} is the best replacement at priority ${best.priorityScore}.` : "No replacement candidate found.";
    } else if (message.includes("policy") || message.includes("recover")) {
      reply = policyDecision.explanation;
    }

    return ok({
      reply,
      manifest: recoveryAgentManifest(),
      trace: { reservationId: reservation._id, risk, policyDecision, ranked: ranked.slice(0, 3) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
