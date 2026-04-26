import { boolEnv, env } from "@/lib/env";
import { audit } from "@/lib/audit";
import { sponsorEvent } from "@/lib/sponsor-events";

export async function verifyWorldIdProof(input: {
  proof?: unknown;
  nullifierHash?: string;
  merkleRoot?: string;
  verificationLevel?: string;
  signal?: string;
  demoMode?: boolean;
}) {
  const configured = Boolean(env("WORLD_ID_APP_ID") && env("WORLD_ID_ACTION_ID") && env("WORLD_ID_SECRET_KEY"));
  if (!configured || !boolEnv("ENABLE_WORLD_ID")) {
    const result = {
      verified: Boolean(input.demoMode),
      mode: "demo",
      nullifierHash: input.nullifierHash ?? `demo_${Date.now().toString(36)}`,
      warning: "World ID not configured; simulated verification is allowed only in demo mode.",
    };
    await sponsorEvent({ sponsor: "world_id", eventType: "world_id_demo_verification", payload: result });
    return result;
  }

  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/verify/${env("WORLD_ID_APP_ID")}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env("WORLD_ID_SECRET_KEY")}`,
      },
      body: JSON.stringify({
        ...input,
        action: env("WORLD_ID_ACTION_ID"),
      }),
    },
  );
  const payload = await response.json();
  const result = {
    verified: response.ok,
    mode: "world_id",
    nullifierHash: input.nullifierHash,
    response: payload,
  };
  await audit({
    actorType: "external_api",
    actorId: "world_id",
    action: "proof_of_human_checked",
    entityType: "worldIdProof",
    entityId: input.nullifierHash ?? "unknown",
    after: result,
  });
  await sponsorEvent({ sponsor: "world_id", eventType: "proof_of_human_checked", payload: result });
  return result;
}
