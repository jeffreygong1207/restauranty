import { handleApiError, ok, readJson } from "@/lib/api";
import { searchGooglePlaces, type PlaceSearchInput } from "@/lib/services/googlePlaces";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const result = await searchGooglePlaces({
      query: url.searchParams.get("query") ?? "sushi",
      location: url.searchParams.get("location") ?? "Los Angeles, CA",
      cuisine: url.searchParams.get("cuisine") ?? undefined,
      priceLevel: url.searchParams.get("priceLevel") ?? undefined,
      openNow: url.searchParams.get("openNow") === "true",
    });
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJson<PlaceSearchInput>(request);
    const result = await searchGooglePlaces(body);
    return ok(result);
  } catch (error) {
    return handleApiError(error);
  }
}
