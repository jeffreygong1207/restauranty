import { boolEnv, env } from "@/lib/env";
import { sponsorEvent } from "@/lib/sponsor-events";

export async function syncAgentverse(payload: unknown) {
  const configured = Boolean(env("FETCH_AGENTVERSE_KEY") || env("AGENTVERSE_MAILBOX_KEY"));
  if (!configured) {
    return {
      mode: "local",
      status: "missing_credentials",
      agentAddress: env("AGENTVERSE_AGENT_ADDRESS"),
    };
  }
  if (!boolEnv("ENABLE_AGENTVERSE_SYNC")) {
    return {
      mode: "local",
      status: "sync_disabled",
      agentAddress: env("AGENTVERSE_AGENT_ADDRESS"),
    };
  }

  await sponsorEvent({
    sponsor: "fetch_ai",
    eventType: "agentverse_sync_attempted",
    payload: { agentAddress: env("AGENTVERSE_AGENT_ADDRESS"), payload },
  });
  return {
    mode: "agentverse",
    status: "attempt_logged",
    agentAddress: env("AGENTVERSE_AGENT_ADDRESS"),
    note: "Direct Agentverse registration is documented in docs/AGENTVERSE.md; this app exposes a local Chat Protocol endpoint.",
  };
}
