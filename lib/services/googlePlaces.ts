import { boolEnv, env } from "@/lib/env";
import { seedRestaurants } from "@/lib/seed/seed-data";
import type { BusinessStatus, Restaurant } from "@/lib/types";

export type PlaceSearchInput = {
  query?: string;
  location?: string;
  cuisine?: string;
  priceLevel?: string;
  openNow?: boolean;
  radius?: number;
};

export type PlaceResult = {
  googlePlaceId: string;
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  userRatingsTotal?: number;
  price?: string;
  priceLevel?: number;
  phone?: string;
  website?: string;
  imageUrl?: string;
  photoReference?: string;
  cuisineCategories: string[];
  types?: string[];
  businessStatus?: BusinessStatus;
  googleMapsUri?: string;
  coordinates: { lat: number; lng: number };
  source: "google_places" | "seed";
};

const FIELD_MASK_SEARCH = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.types",
  "places.location",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.photos",
  "places.businessStatus",
  "places.googleMapsUri",
].join(",");

const FIELD_MASK_DETAILS = [
  "id",
  "displayName",
  "formattedAddress",
  "rating",
  "userRatingCount",
  "priceLevel",
  "types",
  "location",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "websiteUri",
  "photos",
  "businessStatus",
  "googleMapsUri",
  "regularOpeningHours",
].join(",");

function fallbackPlaces(input: PlaceSearchInput): PlaceResult[] {
  const query = (input.query ?? "sushi").toLowerCase();
  return seedRestaurants
    .filter((restaurant) => {
      const haystack = `${restaurant.name} ${restaurant.cuisineCategories.join(" ")}`.toLowerCase();
      return haystack.includes(query) || query === "restaurant" || query === "sushi";
    })
    .map((restaurant) => ({
      googlePlaceId: restaurant.externalIds.googlePlaceId ?? restaurant._id,
      name: restaurant.name,
      address: restaurant.address,
      rating: restaurant.rating,
      reviewCount: restaurant.reviewCount,
      price: restaurant.price,
      phone: restaurant.phone,
      website: restaurant.website,
      imageUrl: restaurant.imageUrl,
      cuisineCategories: restaurant.cuisineCategories,
      coordinates: restaurant.coordinates,
      source: "seed",
    }));
}

function priceLabel(priceLevel?: number) {
  if (priceLevel == null) return undefined;
  return "$".repeat(Math.max(1, Math.min(4, priceLevel)));
}

export async function searchGooglePlaces(input: PlaceSearchInput = {}): Promise<{
  results: PlaceResult[];
  mode: "google_places" | "seed_fallback";
  warning?: string;
}> {
  const apiKey = env("GOOGLE_MAPS_API_KEY");
  if (!apiKey || !boolEnv("ENABLE_GOOGLE_PLACES")) {
    return {
      results: fallbackPlaces(input),
      mode: "seed_fallback",
      warning: "Google Places is missing or disabled; showing seeded fallback restaurants.",
    };
  }

  const textQuery = `${input.query ?? "sushi"} restaurants in ${input.location ?? "Los Angeles, CA"}`;
  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK_SEARCH,
      },
      body: JSON.stringify({
        textQuery,
        openNow: input.openNow || undefined,
      }),
    });
    if (!response.ok) {
      return {
        results: fallbackPlaces(input),
        mode: "seed_fallback",
        warning: `Google Places returned ${response.status}; showing seeded fallback.`,
      };
    }
    const data = (await response.json()) as { places?: GooglePlaceResponse[] };
    const results = data.places?.map((place) => normalizeGooglePlace(place, apiKey, input.query)) ?? [];
    return {
      results: results.length ? results : fallbackPlaces(input),
      mode: results.length ? "google_places" : "seed_fallback",
      warning: results.length ? undefined : "Google Places returned no results; showing seeded fallback.",
    };
  } catch (error) {
    return {
      results: fallbackPlaces(input),
      mode: "seed_fallback",
      warning: error instanceof Error ? error.message : "Google Places failed; showing seeded fallback.",
    };
  }
}

type GooglePlaceResponse = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string | number;
  types?: string[];
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  location?: { latitude?: number; longitude?: number };
  photos?: Array<{ name?: string }>;
  businessStatus?: string;
  googleMapsUri?: string;
};

function normalizeGooglePlace(place: GooglePlaceResponse, apiKey: string, queryHint?: string): PlaceResult {
  const photoName = place.photos?.[0]?.name;
  const numericPriceLevel =
    typeof place.priceLevel === "number"
      ? place.priceLevel
      : typeof place.priceLevel === "string"
        ? Number(place.priceLevel.replace("PRICE_LEVEL_", "")) || undefined
        : undefined;
  const price = numericPriceLevel ? priceLabel(numericPriceLevel) : undefined;
  return {
    googlePlaceId: place.id,
    name: place.displayName?.text ?? "Unnamed restaurant",
    address: place.formattedAddress ?? "Address unavailable",
    rating: place.rating,
    reviewCount: place.userRatingCount,
    userRatingsTotal: place.userRatingCount,
    price,
    priceLevel: numericPriceLevel,
    phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber,
    website: place.websiteUri,
    imageUrl: photoName
      ? `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=900&key=${apiKey}`
      : undefined,
    photoReference: photoName,
    cuisineCategories: place.types?.slice(0, 5) ?? [queryHint ?? "restaurant"],
    types: place.types,
    businessStatus: (place.businessStatus as BusinessStatus | undefined) ?? "OPERATIONAL",
    googleMapsUri: place.googleMapsUri,
    coordinates: {
      lat: place.location?.latitude ?? 34.0522,
      lng: place.location?.longitude ?? -118.2437,
    },
    source: "google_places" as const,
  };
}

export async function getPlaceDetails(placeId: string): Promise<{
  result: PlaceResult | null;
  mode: "google_places" | "seed_fallback";
  warning?: string;
}> {
  if (!placeId) return { result: null, mode: "seed_fallback", warning: "placeId required" };
  const apiKey = env("GOOGLE_MAPS_API_KEY");
  if (!apiKey || !boolEnv("ENABLE_GOOGLE_PLACES")) {
    const seed = seedRestaurants.find((r) => r.externalIds.googlePlaceId === placeId);
    if (!seed) return { result: null, mode: "seed_fallback", warning: "Google Places disabled" };
    const fallback = fallbackPlaces({ query: seed.name }).find((p) => p.googlePlaceId === placeId);
    return { result: fallback ?? null, mode: "seed_fallback", warning: "Google Places disabled; using seed." };
  }
  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK_DETAILS,
      },
    });
    if (!response.ok) {
      return {
        result: null,
        mode: "seed_fallback",
        warning: `Google Places details returned ${response.status}`,
      };
    }
    const place = (await response.json()) as GooglePlaceResponse;
    return { result: normalizeGooglePlace(place, apiKey), mode: "google_places" };
  } catch (error) {
    return {
      result: null,
      mode: "seed_fallback",
      warning: error instanceof Error ? error.message : "Google Places details failed.",
    };
  }
}

export function normalizePlaceToRestaurant(place: PlaceResult, ownerUserId?: string): Restaurant {
  const now = new Date().toISOString();
  return {
    _id: `rest_google_${place.googlePlaceId.replace(/[^a-zA-Z0-9]/g, "_")}`,
    source: place.source === "google_places" ? "google_places" : "seed",
    externalIds: { googlePlaceId: place.googlePlaceId },
    name: place.name,
    cuisineCategories: place.cuisineCategories,
    phone: place.phone,
    website: place.website,
    imageUrl: place.imageUrl,
    rating: place.rating,
    reviewCount: place.reviewCount,
    userRatingsTotal: place.userRatingsTotal,
    price: place.price,
    priceLevel: place.priceLevel,
    businessStatus: place.businessStatus,
    types: place.types,
    googleMapsUri: place.googleMapsUri,
    address: place.address,
    coordinates: place.coordinates,
    averageCheck: place.price?.length ? place.price.length * 45 : 90,
    neighborhood: place.address.split(",")[1]?.trim() ?? "Los Angeles",
    ownerUserId,
    claimed: Boolean(ownerUserId),
    claimStatus: ownerUserId ? "pending" : undefined,
    createdAt: now,
    updatedAt: now,
  };
}
