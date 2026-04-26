import { handleApiError, ok, readJson } from "@/lib/api";
import { syncRecoveryAgentToAgentverse } from "@/lib/agents/agentverseAdapter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const result = await syncRecoveryAgentToAgentverse(await readJson(request));
    return ok({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
