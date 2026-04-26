import { handleApiError, ok, readJson } from "@/lib/api";
import { cloudinarySignature } from "@/lib/services/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson<Record<string, string | number>>(request);
    const result = cloudinarySignature(body);
    return ok({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
