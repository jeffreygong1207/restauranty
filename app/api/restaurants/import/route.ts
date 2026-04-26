import { handleApiError, ok, readJson } from "@/lib/api";
import { audit } from "@/lib/audit";
import { sponsorEvent } from "@/lib/sponsor-events";
import { policyInputSchema } from "@/lib/validators";
import { normalizePlaceToRestaurant, searchGooglePlaces, type PlaceResult } from "@/lib/services/googlePlaces";
import { savePolicy, saveRestaurant } from "@/lib/repositories/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await readJson<{ place?: PlaceResult; googlePlaceId?: string }>(request);
    let place = body.place;
    if (!place && body.googlePlaceId) {
      const result = await searchGooglePlaces({ query: "sushi", location: "Los Angeles, CA" });
      place = result.results.find((item) => item.googlePlaceId === body.googlePlaceId);
    }
    if (!place) return Response.json({ ok: false, error: "No place supplied" }, { status: 400 });

    const restaurant = await saveRestaurant(normalizePlaceToRestaurant(place));
    const now = new Date().toISOString();
    const policy = policyInputSchema.parse({ restaurantId: restaurant._id });
    await savePolicy({
      _id: `policy_${restaurant._id}`,
      ...policy,
      createdAt: now,
      updatedAt: now,
    });
    await audit({
      actorType: "user",
      actorId: "user_sofia",
      action: "restaurant_imported",
      entityType: "restaurant",
      entityId: restaurant._id,
      after: restaurant,
    });
    await sponsorEvent({
      sponsor: "mongodb",
      eventType: "restaurant_import_persisted",
      payload: { restaurantId: restaurant._id, source: restaurant.source },
    });
    await sponsorEvent({
      sponsor: "arista",
      eventType: "public_restaurant_data_connected",
      payload: { restaurantId: restaurant._id, source: restaurant.source },
    });
    return ok({ restaurant });
  } catch (error) {
    return handleApiError(error);
  }
}
