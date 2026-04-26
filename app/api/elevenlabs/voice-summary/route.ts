import { handleApiError, ok, readJson } from "@/lib/api";
import { generateVoiceSummary } from "@/lib/services/elevenlabs";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ text: string }>(request);
    const result = await generateVoiceSummary(body.text);
    return ok({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
