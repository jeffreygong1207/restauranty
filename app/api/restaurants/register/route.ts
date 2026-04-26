import { handleApiError, ok, readJson } from "@/lib/api";
import { audit } from "@/lib/audit";
import { sponsorEvent } from "@/lib/sponsor-events";
import { policyInputSchema } from "@/lib/validators";
import {
  id,
  isoNow,
  saveRestaurant,
  saveRestaurantClaim,
  savePolicy,
} from "@/lib/repositories/store";
import { getSessionUser } from "@/lib/services/session";
import type { Restaurant, RestaurantClaim } from "@/lib/types";

export const dynamic = "force-dynamic";

type RegisterInput = {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  cuisine?: string;
  averageCheck?: number;
  managerName?: string;
  managerPhone?: string;
  imageUrl?: string;
  neighborhood?: string;
};

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });
    }
    const body = await readJson<RegisterInput>(request);
    if (!body.name || !body.address) {
      return Response.json(
        { ok: false, error: "Name and address are required" },
        { status: 400 },
      );
    }
    const now = isoNow();
    const restaurantId = id("rest_manual");
    const restaurant: Restaurant = {
      _id: restaurantId,
      source: "manual",
      claimed: true,
      claimStatus: "pending",
      externalIds: {},
      name: body.name,
      cuisineCategories: body.cuisine ? body.cuisine.split(",").map((c) => c.trim()).filter(Boolean) : ["restaurant"],
      phone: body.phone,
      website: body.website,
      imageUrl: body.imageUrl,
      address: body.address,
      coordinates: { lat: 34.0522, lng: -118.2437 },
      averageCheck: body.averageCheck ?? 90,
      neighborhood: body.neighborhood ?? body.address.split(",")[1]?.trim() ?? "Unknown",
      ownerUserId: user._id,
      managerName: body.managerName,
      managerPhone: body.managerPhone,
      createdAt: now,
      updatedAt: now,
    };
    await saveRestaurant(restaurant);

    const claim: RestaurantClaim = {
      _id: id("claim"),
      restaurantId,
      ownerUserId: user._id,
      status: "pending",
      claimMethod: "self_attested",
      createdAt: now,
      updatedAt: now,
    };
    await saveRestaurantClaim(claim);

    const policy = policyInputSchema.parse({ restaurantId });
    await savePolicy({
      _id: `policy_${restaurantId}`,
      ...policy,
      managerApprovalPhone: body.managerPhone ?? policy.managerApprovalPhone,
      createdAt: now,
      updatedAt: now,
    });

    await audit({
      actorType: "user",
      actorId: user._id,
      action: "restaurant_registered_manual",
      entityType: "restaurant",
      entityId: restaurantId,
      after: { restaurant, claim },
    });
    await sponsorEvent({
      sponsor: "mongodb",
      eventType: "restaurant_manual_register_persisted",
      payload: { restaurantId, ownerUserId: user._id },
    });

    return ok({ restaurant, claim });
  } catch (error) {
    return handleApiError(error);
  }
}
