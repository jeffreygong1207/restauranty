import { audit } from "@/lib/audit";
import type {
  Diner,
  FairnessDecision,
  RestaurantPolicy,
  WaitlistCandidate,
} from "@/lib/types";

export async function reviewCandidateFairness(input: {
  candidate: WaitlistCandidate;
  diner?: Diner;
  policy: RestaurantPolicy;
  duplicateClaim?: boolean;
  suspiciousTransferAttempt?: boolean;
  attemptedTransferFee?: number;
  writeAudit?: boolean;
}): Promise<FairnessDecision> {
  const { candidate, diner, policy } = input;
  let decision: FairnessDecision = {
    candidateId: candidate._id,
    decision: "allow",
    reason: "Candidate passes fairness checks.",
  };

  if (policy.humanVerificationRequired && !candidate.verifiedHuman) {
    decision = {
      candidateId: candidate._id,
      decision: "block",
      reason: "Unverified candidate blocked because human verification is required.",
      visibleWarning: "Human verification required before this diner can claim the table.",
    };
  } else if (input.duplicateClaim) {
    decision = {
      candidateId: candidate._id,
      decision: "block",
      reason: "Duplicate waitlist claim detected.",
      visibleWarning: "Duplicate waitlist claim blocked.",
    };
  } else if (diner && diner.activeReservations > 2) {
    decision = {
      candidateId: candidate._id,
      decision: "downgrade",
      reason: "Too many active reservations.",
      visibleWarning: "Candidate downgraded due to reservation velocity.",
    };
  } else if (input.suspiciousTransferAttempt) {
    decision = {
      candidateId: candidate._id,
      decision: "block",
      reason: "Suspicious transfer attempt.",
      visibleWarning: "Transfer requires manager review.",
    };
  } else if ((input.attemptedTransferFee ?? 0) > policy.maxTransferFee) {
    decision = {
      candidateId: candidate._id,
      decision: "block",
      reason: "Fee above policy cap.",
      visibleWarning: "Fee above restaurant policy cap.",
    };
  } else if (diner && diner.noShowCount > 0) {
    decision = {
      candidateId: candidate._id,
      decision: "downgrade",
      reason: "Prior no-show history.",
      visibleWarning: "Candidate downgraded for prior no-show history.",
    };
  }

  if (input.writeAudit) {
    await audit({
      actorType: "agent",
      actorId: "FairnessAgent",
      action: "fairness_review",
      entityType: "waitlistCandidate",
      entityId: candidate._id,
      after: decision,
    });
  }

  return decision;
}
