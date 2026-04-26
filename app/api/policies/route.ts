import { handleApiError, ok, readJson } from "@/lib/api";
import { audit } from "@/lib/audit";
import { id, isoNow, listPolicies, savePolicy } from "@/lib/repositories/store";
import { policyInputSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const policies = await listPolicies();
    return ok({ policies });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = policyInputSchema.parse(await readJson(request));
    const now = isoNow();
    const policy = await savePolicy({
      _id: `policy_${input.restaurantId}_${id("p").slice(-6)}`,
      ...input,
      paidResaleAllowed: false,
      humanVerificationRequired: true,
      createdAt: now,
      updatedAt: now,
    });
    await audit({
      actorType: "user",
      actorId: "user_sofia",
      action: "policy_saved",
      entityType: "restaurantPolicy",
      entityId: policy._id,
      after: policy,
    });
    return ok({ policy });
  } catch (error) {
    return handleApiError(error);
  }
}
