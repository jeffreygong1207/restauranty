import { handleApiError, ok, readJson } from "@/lib/api";
import { getPlaceDetails } from "@/lib/services/googlePlaces";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const placeId = url.searchParams.get("placeId");
    if (!placeId) {
      return Response.json({ ok: false, error: "placeId is required" }, { status: 400 });
    }
    const result = await getPlaceDetails(placeId);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<{ placeId?: string }>(request);
    if (!body.placeId) {
      return Response.json({ ok: false, error: "placeId is required" }, { status: 400 });
    }
    const result = await getPlaceDetails(body.placeId);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
