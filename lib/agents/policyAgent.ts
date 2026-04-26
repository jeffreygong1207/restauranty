import { audit } from "@/lib/audit";
import type { PolicyDecision, Reservation, RestaurantPolicy } from "@/lib/types";

export async function enforcePolicy(input: {
  policy: RestaurantPolicy;
  reservation: Reservation;
  attemptedTransferFee?: number;
  writeAudit?: boolean;
}): Promise<PolicyDecision> {
  const { policy, reservation } = input;
  const attemptedTransferFee = input.attemptedTransferFee ?? 0;
  const warnings: string[] = [];
  const paidResaleBlocked = !policy.paidResaleAllowed || attemptedTransferFee > policy.maxTransferFee;

  if (!policy.paidResaleAllowed) warnings.push("Paid resale is disabled by restaurant policy.");
  if (attemptedTransferFee > policy.maxTransferFee) {
    warnings.push(`Transfer fee ${attemptedTransferFee} exceeds policy cap ${policy.maxTransferFee}.`);
  }
  if (!policy.waitlistRefillEnabled) warnings.push("Waitlist refill is disabled for this restaurant.");
  if (policy.humanVerificationRequired) warnings.push("Replacement diner must be human verified.");

  const decision: PolicyDecision = {
    allowed: policy.waitlistRefillEnabled && !paidResaleBlocked,
    requiresManagerApproval: policy.restaurantApprovalRequired,
    waitlistRefillAllowed: policy.waitlistRefillEnabled,
    feeWaiverAllowed: policy.feeWaiverIfRefilled,
    paidResaleBlocked,
    warnings,
    explanation: policy.waitlistRefillEnabled
      ? "Waitlist refill is allowed, paid resale is blocked, and manager approval is required before settlement."
      : "Recovery cannot proceed because waitlist refill is disabled.",
  };

  if (input.writeAudit) {
    await audit({
      actorType: "agent",
      actorId: "PolicyAgent",
      action: "policy_decision",
      entityType: "reservation",
      entityId: reservation._id,
      after: decision,
    });
  }

  return decision;
}
