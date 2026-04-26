import { enforcePolicy } from "@/lib/agents/policyAgent";
import { scoreReservationRisk } from "@/lib/agents/riskAgent";
import { rankWaitlistCandidates } from "@/lib/agents/waitlistAgent";
import { reviewCandidateFairness } from "@/lib/agents/fairnessAgent";
import { runConfirmationAgent } from "@/lib/agents/confirmationAgent";
import { requestManagerApproval } from "@/lib/agents/restaurantAgent";
import { explainRecovery } from "@/lib/agents/explanationAgent";
import { syncRecoveryAgentToAgentverse } from "@/lib/agents/agentverseAdapter";
import {
  getDiner,
  getPolicyForRestaurant,
  getReservation,
  getRestaurant,
  listDiners,
  listWaitlistCandidates,
  saveAgentLog,
  saveAgentRun,
  saveRecoveryRequest,
  saveReservation,
  id,
  isoNow,
} from "@/lib/repositories/store";
import { audit } from "@/lib/audit";
import { sponsorEvent } from "@/lib/sponsor-events";
import type { AgentLog, AgentRun, RecoveryRequest, Reservation } from "@/lib/types";

async function log(run: AgentRun, reservationId: string, entry: Omit<AgentLog, "_id" | "agentRunId" | "reservationId" | "createdAt">) {
  await saveAgentLog({
    _id: id("alog"),
    agentRunId: run._id,
    reservationId,
    createdAt: isoNow(),
    ...entry,
  });
}

export async function runRecoveryWorkflow(reservationId: string) {
  const reservation = await getReservation(reservationId);
  if (!reservation) throw new Error(`Reservation ${reservationId} not found`);
  const restaurant = await getRestaurant(reservation.restaurantId);
  const diner = await getDiner(reservation.dinerId);
  if (!restaurant || !diner) throw new Error("Reservation is missing restaurant or diner data");
  const policy = await getPolicyForRestaurant(restaurant._id);

  const run: AgentRun = await saveAgentRun({
    _id: id("run"),
    reservationId,
    status: "started",
    agentsInvoked: [],
    inputSnapshot: { reservationId },
    createdAt: isoNow(),
  });

  try {
    const risk = scoreReservationRisk({ reservation, diner, restaurant, policy });
    await log(run, reservationId, {
      agentName: "RiskAgent",
      message: risk.explanation,
      severity: risk.level === "critical" ? "warning" : "info",
      status: "completed",
      metadata: risk,
    });

    const updatedReservation: Reservation = {
      ...reservation,
      riskScore: risk.score,
      riskLevel: risk.level,
      recommendedAction: risk.recommendedAction,
      status:
        risk.score >= 80 && reservation.status !== "released_by_diner"
          ? "final_confirmation_sent"
          : reservation.status,
      updatedAt: isoNow(),
    };
    await saveReservation(updatedReservation);

    const policyDecision = await enforcePolicy({ policy, reservation: updatedReservation, writeAudit: true });
    await log(run, reservationId, {
      agentName: "PolicyAgent",
      message: policyDecision.explanation,
      severity: policyDecision.allowed ? "success" : "warning",
      status: "completed",
      metadata: policyDecision,
    });

    const notification = await runConfirmationAgent({ reservation: updatedReservation, diner, restaurant });
    await log(run, reservationId, {
      agentName: "ConfirmationAgent",
      message: `Confirmation ${notification.status} through ${notification.provider}.`,
      severity: notification.status === "sent" || notification.status === "simulated" ? "success" : "warning",
      status: "completed",
      metadata: notification,
    });

    const candidates = await listWaitlistCandidates(restaurant._id);
    const diners = await listDiners();
    const rankedCandidates = rankWaitlistCandidates({
      reservation: updatedReservation,
      restaurant,
      policy,
      candidates,
      diners,
    });
    const fairnessReviews = [];
    let selected = undefined;
    for (const candidate of rankedCandidates) {
      const candidateDiner = diners.find((item) => item._id === candidate.dinerId);
      const fairness = await reviewCandidateFairness({
        candidate,
        diner: candidateDiner,
        policy,
        writeAudit: true,
      });
      fairnessReviews.push(fairness);
      if (!selected && fairness.decision !== "block") selected = candidate;
    }

    await log(run, reservationId, {
      agentName: "WaitlistAgent",
      message: selected
        ? `Selected candidate ${selected.dinerId} with score ${selected.priorityScore}.`
        : "No eligible replacement diner selected.",
      severity: selected ? "success" : "warning",
      status: "completed",
      metadata: { rankedCandidates, fairnessReviews },
    });

    const request: RecoveryRequest = await saveRecoveryRequest({
      _id: id("recovery"),
      reservationId,
      restaurantId: restaurant._id,
      originalDinerId: diner._id,
      selectedReplacementDinerId: selected?.dinerId,
      status: policyDecision.requiresManagerApproval
        ? "manager_approval_required"
        : selected
          ? "approved"
          : "failed",
      policySnapshot: policyDecision,
      riskSnapshot: risk,
      selectedCandidateSnapshot: selected,
      revenueProtected: selected ? updatedReservation.estimatedRevenue : 0,
      feeWaived: false,
      startedAt: isoNow(),
      createdAt: isoNow(),
      updatedAt: isoNow(),
    });

    if (policyDecision.requiresManagerApproval) {
      await requestManagerApproval(request);
    }

    const explanation = await explainRecovery({
      risk,
      policy: policyDecision,
      candidateName: selected ? diners.find((item) => item._id === selected?.dinerId)?.name : undefined,
    });

    const agentverse = await syncRecoveryAgentToAgentverse({
      reservationId,
      risk,
      policy: policyDecision,
      selectedCandidate: selected,
    });

    await sponsorEvent({
      sponsor: "fetch_ai",
      eventType: "recovery_agent_workflow_run",
      payload: { reservationId, agentverse },
    });
    await sponsorEvent({
      sponsor: "cognition",
      eventType: "deterministic_recovery_trace_written",
      payload: { reservationId, runId: run._id },
    });
    await audit({
      actorType: "agent",
      actorId: "RecoveryAgent",
      action: "recovery_workflow_completed",
      entityType: "reservation",
      entityId: reservationId,
      after: { request, explanation },
    });

    const completedRun = await saveAgentRun({
      ...run,
      status: "completed",
      agentsInvoked: [
        "RiskAgent",
        "PolicyAgent",
        "ConfirmationAgent",
        "WaitlistAgent",
        "FairnessAgent",
        "RestaurantAgent",
        "ExplanationAgent",
      ],
      outputSnapshot: {
        risk,
        policyDecision,
        rankedCandidates,
        fairnessReviews,
        request,
        explanation,
        agentverse,
      },
      completedAt: isoNow(),
    });

    return {
      run: completedRun,
      reservation: updatedReservation,
      restaurant,
      diner,
      policy,
      risk,
      policyDecision,
      rankedCandidates,
      fairnessReviews,
      recoveryRequest: request,
      explanation,
      agentverse,
    };
  } catch (error) {
    await saveAgentRun({
      ...run,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
      completedAt: isoNow(),
    });
    throw error;
  }
}
