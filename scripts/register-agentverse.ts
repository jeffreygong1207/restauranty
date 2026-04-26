import { loadEnvConfig } from "@next/env";
import { recoveryAgentManifest } from "@/lib/agents/agentverseAdapter";
import { syncRecoveryAgentToAgentverse } from "@/lib/agents/agentverseAdapter";

loadEnvConfig(process.cwd());

async function main() {
  const manifest = recoveryAgentManifest();
  console.log("Restauranty Recovery Agent manifest:");
  console.log(JSON.stringify(manifest, null, 2));
  const result = await syncRecoveryAgentToAgentverse({ manifest, registration: "manual-or-api" });
  console.log("Agentverse sync result:");
  console.log(JSON.stringify(result, null, 2));
  console.log("Manual registration steps are documented in docs/AGENTVERSE.md.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
