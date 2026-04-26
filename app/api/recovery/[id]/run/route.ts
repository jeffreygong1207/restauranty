import { handleApiError, ok } from "@/lib/api";
import { runRecoveryWorkflow } from "@/lib/agents/recoveryAgent";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const result = await runRecoveryWorkflow(id);
    return ok({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
