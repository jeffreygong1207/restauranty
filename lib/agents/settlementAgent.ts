import { audit } from "@/lib/audit";
import { sponsorEvent } from "@/lib/sponsor-events";
import { saveReservation } from "@/lib/repositories/reservations";
import { saveWaitlistCandidate } from "@/lib/repositories/waitlist";
import type {
  RecoveryRequest,
  Reservation,
  RestaurantPolicy,
  WaitlistCandidate,
} from "@/lib/types";

export async function settleRecovery(input: {
  reservation: Reservation;
  candidate: WaitlistCandidate;
  policy: RestaurantPolicy;
  request: RecoveryRequest;
}) {
  const feeWaived = input.policy.feeWaiverIfRefilled;
  const reservation: Reservation = {
    ...input.reservation,
    status: "recovered",
    recoveryStatus: "recovered",
    updatedAt: new Date().toISOString(),
  };
  const candidate: WaitlistCandidate = {
    ...input.candidate,
    status: "accepted",
    updatedAt: new Date().toISOString(),
  };

  await saveReservation(reservation);
  await saveWaitlistCandidate(candidate);
  await audit({
    actorType: "agent",
    actorId: "SettlementAgent",
    action: "recovery_settled",
    entityType: "reservation",
    entityId: reservation._id,
    after: { status: "recovered", feeWaived, revenueProtected: reservation.estimatedRevenue },
  });
  await sponsorEvent({
    sponsor: "mongodb",
    eventType: "recovery_settlement_persisted",
    payload: { reservationId: reservation._id },
  });
  await sponsorEvent({
    sponsor: "arista",
    eventType: "restaurant_diner_waitlist_connected",
    payload: { reservationId: reservation._id, candidateId: candidate._id },
  });

  return {
    reservation,
    candidate,
    feeWaived,
    revenueProtected: reservation.estimatedRevenue,
  };
}
