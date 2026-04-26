import { handleApiError, ok, readJson } from "@/lib/api";
import { rankWaitlistCandidates } from "@/lib/agents/waitlistAgent";
import {
  getPolicyForRestaurant,
  getReservation,
  getRestaurant,
  id,
  isoNow,
  listDiners,
  listWaitlistCandidates,
  saveDiner,
  saveWaitlistCandidate,
} from "@/lib/repositories/store";
import { waitlistInputSchema } from "@/lib/validators";
import type { Diner, WaitlistCandidate } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const restaurantId = url.searchParams.get("restaurantId") ?? undefined;
    const reservationId = url.searchParams.get("reservationId") ?? undefined;
    const candidates = await listWaitlistCandidates(restaurantId);
    if (reservationId) {
      const reservation = await getReservation(reservationId);
      const restaurant = reservation ? await getRestaurant(reservation.restaurantId) : null;
      const policy = reservation ? await getPolicyForRestaurant(reservation.restaurantId) : null;
      const diners = await listDiners();
      if (reservation && restaurant && policy) {
        return ok({
          candidates,
          ranked: rankWaitlistCandidates({ reservation, restaurant, policy, candidates, diners }),
        });
      }
    }
    return ok({ candidates });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = waitlistInputSchema.parse(await readJson(request));
    let dinerId = input.dinerId;
    if (!dinerId) {
      const now = isoNow();
      const diner: Diner = {
        _id: id("diner"),
        name: input.name ?? "Waitlist Diner",
        phone: input.phone ?? "+10000000001",
        email: input.email ?? `waitlist-${Date.now()}@restauranty.demo`,
        verifiedHuman: input.verifiedHuman,
        noShowCount: 0,
        lateCancellationCount: 0,
        completedReservations: 0,
        activeReservations: 0,
        trustScore: input.verifiedHuman ? 80 : 55,
        preferredCuisines: [],
        createdAt: now,
        updatedAt: now,
      };
      dinerId = (await saveDiner(diner))._id;
    }
    const now = isoNow();
    const candidate: WaitlistCandidate = {
      _id: id("wait"),
      dinerId,
      restaurantId: input.restaurantId,
      desiredDate: input.desiredDate,
      desiredTimeWindowStart: input.desiredTimeWindowStart,
      desiredTimeWindowEnd: input.desiredTimeWindowEnd,
      partySize: input.partySize,
      distanceMiles: input.distanceMiles,
      cuisineMatchScore: input.cuisineMatchScore,
      arrivalEtaMinutes: input.arrivalEtaMinutes,
      verifiedHuman: input.verifiedHuman,
      commitmentLevel: input.commitmentLevel,
      priorityScore: 0,
      status: "available",
      createdAt: now,
      updatedAt: now,
    };
    await saveWaitlistCandidate(candidate);
    return ok({ candidate });
  } catch (error) {
    return handleApiError(error);
  }
}
