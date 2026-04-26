import type {
  Diner,
  Reservation,
  Restaurant,
  RestaurantPolicy,
  RiskFactor,
  RiskLevel,
  RiskResult,
} from "@/lib/types";

function hoursUntil(date: string, startTime: string, now: Date) {
  const target = new Date(`${date}T${startTime.length === 5 ? startTime : "20:00"}:00`);
  return (target.getTime() - now.getTime()) / (1000 * 60 * 60);
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function riskLevel(score: number): RiskLevel {
  if (score < 30) return "low";
  if (score < 60) return "medium";
  if (score < 80) return "high";
  return "critical";
}

export function recommendedAction(reservation: Reservation, score: number) {
  if (reservation.status === "released_by_diner") return "activate waitlist recovery";
  if (reservation.recoveryStatus === "suspicious_transfer") return "require manager review";
  if (score < 30) return "hold";
  if (score < 60) return "monitor";
  if (score < 80) return "send final confirmation";
  return "send final confirmation and prepare waitlist recovery";
}

export function scoreReservationRisk(input: {
  reservation: Reservation;
  diner: Diner;
  restaurant?: Restaurant;
  policy: RestaurantPolicy;
  now?: Date;
}): RiskResult {
  const { reservation, diner, policy } = input;
  const now = input.now ?? new Date();
  const factors: RiskFactor[] = [{ name: "Base risk", weight: 10, reason: "Default table risk" }];
  const add = (condition: boolean, name: string, weight: number, reason: string) => {
    if (condition) factors.push({ name, weight, reason });
  };

  const hours = hoursUntil(reservation.date, reservation.startTime, now);
  add(
    reservation.confirmationStatus !== "confirmed" &&
      hours <= policy.confirmationWindowHours &&
      hours >= -1,
    "Unconfirmed inside confirmation window",
    20,
    `Reservation is inside the ${policy.confirmationWindowHours}h confirmation window.`,
  );
  add(
    reservation.confirmationStatus === "ignored",
    "Final confirmation ignored",
    24,
    "Diner ignored the final confirmation request.",
  );
  add(
    !reservation.reminderOpened,
    "Reminder not opened",
    14,
    "The reminder was sent but not opened.",
  );
  const lateCancelWeight = Math.min(30, reservation.priorLateCancellationsAtBooking * 12);
  add(lateCancelWeight > 0, "Prior late cancellation", lateCancelWeight, "Prior late cancellation history.");
  const noShowWeight = Math.min(40, reservation.priorNoShowsAtBooking * 20);
  add(noShowWeight > 0, "Prior no-show", noShowWeight, "Prior no-show history.");
  add(
    hours <= 4 && hours >= -1 && reservation.confirmationStatus !== "confirmed",
    "Starts within 4 hours and not confirmed",
    12,
    "The table is close to seating time without confirmation.",
  );
  add(reservation.highDemandSlot, "High-demand slot", 8, "The table is during a high-demand window.");
  add(reservation.partySize >= 5, "Large party", 10, "Large parties are harder to refill.");
  add(!reservation.cardOnFile, "No card on file", 8, "No card on file weakens diner commitment.");
  add(diner.trustScore < 50, "Low diner trust score", 15, "Trust score is below 50.");
  add(
    diner.activeReservations > 1,
    "Multiple active reservations same night",
    12,
    "Diner has multiple active reservations.",
  );
  add(diner.verifiedHuman, "Verified human", -8, "Verified human status reduces bot risk.");
  add(reservation.cardOnFile, "Card on file", -6, "Card on file increases commitment.");
  add(diner.trustScore >= 85, "High diner trust score", -10, "Trust score is 85 or higher.");
  add(reservation.confirmationStatus === "confirmed", "Confirmed", -30, "Diner confirmed attendance.");
  add(
    diner.completedReservations >= 5 && diner.noShowCount === 0,
    "Good completion history",
    -8,
    "Diner has completed at least five reservations with no no-shows.",
  );

  const score = clamp(factors.reduce((sum, factor) => sum + factor.weight, 0));
  const level = riskLevel(score);
  const action = recommendedAction(reservation, score);
  const explanation = `${reservation._id} scored ${score}/100 (${level}) because ${factors
    .filter((factor) => factor.weight > 0)
    .slice(0, 3)
    .map((factor) => factor.name.toLowerCase())
    .join(", ")}. Recommended action: ${action}.`;

  return { score, level, factors, explanation, recommendedAction: action };
}
