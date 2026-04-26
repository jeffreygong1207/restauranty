import type { Diner, Reservation, Restaurant, RestaurantPolicy, WaitlistCandidate } from "@/lib/types";

export type RankedCandidate = WaitlistCandidate & {
  rankingFactors: string[];
};

export function rankWaitlistCandidates(input: {
  reservation: Reservation;
  restaurant: Restaurant;
  policy: RestaurantPolicy;
  candidates: WaitlistCandidate[];
  diners: Diner[];
}): RankedCandidate[] {
  const { reservation, policy, candidates, diners } = input;
  return candidates
    .filter((candidate) => candidate.restaurantId === reservation.restaurantId)
    .map((candidate) => {
      const diner = diners.find((item) => item._id === candidate.dinerId);
      let score = 0;
      const rankingFactors: string[] = [];
      const add = (condition: boolean, weight: number, label: string) => {
        if (condition) {
          score += weight;
          rankingFactors.push(`${weight > 0 ? "+" : ""}${weight} ${label}`);
        }
      };

      add(candidate.partySize === reservation.partySize, 30, "exact party size match");
      add(candidate.verifiedHuman, 20, "verified human");
      add(candidate.arrivalEtaMinutes <= 20, 20, "ETA <= 20 minutes");
      add(candidate.distanceMiles <= 2, 15, "distance <= 2 miles");
      add(candidate.cuisineMatchScore >= 75, 10, "cuisine match");
      add(
        candidate.commitmentLevel === "deposit_ready" ||
          candidate.commitmentLevel === "instant_confirm",
        10,
        "strong commitment",
      );
      add(policy.humanVerificationRequired && !candidate.verifiedHuman, -25, "unverified while verification required");
      add(candidate.partySize !== reservation.partySize, -20, "party mismatch");
      add(Boolean(diner && (diner.noShowCount > 0 || diner.trustScore < 50)), -30, "suspicious history");
      add(candidate.arrivalEtaMinutes > 30, -10, "ETA > 30 minutes");
      add(candidate.distanceMiles > 5, -10, "distance > 5 miles");

      return {
        ...candidate,
        priorityScore: Math.max(0, Math.min(100, score)),
        rankingFactors,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
