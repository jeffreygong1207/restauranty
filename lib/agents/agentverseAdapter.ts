import { boolEnv, env } from "@/lib/env";
import { syncAgentverse } from "@/lib/services/agentverse";

export async function syncRecoveryAgentToAgentverse(payload: unknown) {
  if (!boolEnv("ENABLE_AGENTVERSE_SYNC")) {
    return {
      mode: "local",
      status: "skipped",
      reason: "ENABLE_AGENTVERSE_SYNC is false",
      agentAddress: env("AGENTVERSE_AGENT_ADDRESS"),
    };
  }
  return syncAgentverse(payload);
}

export function recoveryAgentManifest() {
  return {
    name: env("AGENTVERSE_AGENT_NAME") ?? "Restauranty Recovery Agent",
    address: env("AGENTVERSE_AGENT_ADDRESS") ?? "local-demo-agent",
    intents: [
      "Which reservations are high risk?",
      "Why is this reservation risky?",
      "What action should the restaurant take?",
      "Who is the best replacement diner?",
      "Can this table be recovered under policy?",
    ],
    framing:
      "Restauranty turns restaurant manager intent into executable recovery actions: risk analysis, policy checking, verified waitlist matching, and manager-approved table recovery.",
  };
}
