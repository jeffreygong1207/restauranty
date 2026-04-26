import { handleApiError, ok, readJson } from "@/lib/api";
import { verifyWorldIdProof } from "@/lib/services/worldId";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const result = await verifyWorldIdProof(await readJson(request));
    return ok({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
