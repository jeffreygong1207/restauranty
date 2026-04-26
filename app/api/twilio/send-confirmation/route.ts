import { handleApiError, ok, readJson } from "@/lib/api";
import { sendConfirmationMessage } from "@/lib/services/twilio";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ to: string; message: string; reservationId: string }>(request);
    const result = await sendConfirmationMessage(body);
    return ok({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
