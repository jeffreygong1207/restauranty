import { handleApiError, ok, readJson } from "@/lib/api";
import { audit } from "@/lib/audit";
import { sponsorEvent } from "@/lib/sponsor-events";
import { policyInputSchema } from "@/lib/validators";
import { getPlaceDetails, normalizePlaceToRestaurant } from "@/lib/services/googlePlaces";
import {
  getRestaurantByPlaceId,
  id,
  isoNow,
  saveRestaurant,
  saveRestaurantClaim,
  savePolicy,
} from "@/lib/repositories/store";
import { getSessionUser } from "@/lib/services/session";
import type { RestaurantClaim } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });
    }
    const body = await readJson<{
      placeId: string;
      claimMethod?: "self_attested" | "email_domain" | "phone" | "admin_review";
      managerName?: string;
      managerPhone?: string;
      evidence?: Record<string, unknown>;
    }>(request);
    if (!body.placeId) {
      return Response.json({ ok: false, error: "placeId required" }, { status: 400 });
    }

    const existing = await getRestaurantByPlaceId(body.placeId);
    if (existing && existing.ownerUserId && existing.ownerUserId !== user._id) {
      return Response.json(
        { ok: false, error: "This restaurant has already been claimed by another owner." },
        { status: 409 },
      );
    }

    const details = await getPlaceDetails(body.placeId);
    if (!details.result) {
      return Response.json(
        { ok: false, error: details.warning ?? "Place not found" },
        { status: 404 },
      );
    }

    const baseRestaurant = existing ?? normalizePlaceToRestaurant(details.result, user._id);
    const restaurant = await saveRestaurant({
      ...baseRestaurant,
      ownerUserId: user._id,
      claimed: true,
      claimStatus: "verified",
      managerName: body.managerName ?? baseRestaurant.managerName,
      managerPhone: body.managerPhone ?? baseRestaurant.managerPhone,
      updatedAt: isoNow(),
    });

    const now = isoNow();
    const claim: RestaurantClaim = {
      _id: id("claim"),
      restaurantId: restaurant._id,
      ownerUserId: user._id,
      status: "verified",
      claimMethod: body.claimMethod ?? "self_attested",
      evidence: body.evidence,
      createdAt: now,
      updatedAt: now,
    };
    await saveRestaurantClaim(claim);

    const policy = policyInputSchema.parse({ restaurantId: restaurant._id });
    await savePolicy({
      _id: `policy_${restaurant._id}`,
      ...policy,
      managerApprovalPhone: body.managerPhone ?? policy.managerApprovalPhone,
      createdAt: now,
      updatedAt: now,
    });

    await audit({
      actorType: "user",
      actorId: user._id,
      action: "restaurant_claimed",
      entityType: "restaurant",
      entityId: restaurant._id,
      after: { restaurant, claim },
    });
    await sponsorEvent({
      sponsor: "mongodb",
      eventType: "restaurant_claim_persisted",
      payload: { restaurantId: restaurant._id, ownerUserId: user._id },
    });

    return ok({ restaurant, claim });
  } catch (error) {
    return handleApiError(error);
  }
}
