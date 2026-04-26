import { handleApiError, ok, readJson } from "@/lib/api";
import { audit } from "@/lib/audit";
import { scoreReservationRisk } from "@/lib/agents/riskAgent";
import {
  getDiner,
  getPolicyForRestaurant,
  getRestaurant,
  id,
  isoNow,
  listDiners,
  listReservations,
  listRestaurants,
  saveDiner,
  saveReservation,
} from "@/lib/repositories/store";
import { csvReservationRowSchema, reservationInputSchema } from "@/lib/validators";
import type { Diner, Reservation } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [reservations, restaurants, diners] = await Promise.all([
      listReservations(),
      listRestaurants(),
      listDiners(),
    ]);
    return ok({ reservations, restaurants, diners });
  } catch (error) {
    return handleApiError(error);
  }
}

async function dinerForInput(input: {
  dinerId?: string;
  dinerName?: string;
  dinerPhone?: string;
  dinerEmail?: string;
}) {
  if (input.dinerId) {
    const diner = await getDiner(input.dinerId);
    if (diner) return diner;
  }
  const now = isoNow();
  const diner: Diner = {
    _id: id("diner"),
    name: input.dinerName ?? "Guest Diner",
    phone: input.dinerPhone ?? "+10000000000",
    email: input.dinerEmail ?? `guest-${Date.now()}@restauranty.demo`,
    verifiedHuman: false,
    noShowCount: 0,
    lateCancellationCount: 0,
    completedReservations: 0,
    activeReservations: 1,
    trustScore: 70,
    preferredCuisines: [],
    createdAt: now,
    updatedAt: now,
  };
  return saveDiner(diner);
}

export async function POST(request: Request) {
  try {
    const body = await readJson<unknown>(request);
    if (typeof body === "object" && body && "csvRows" in body) {
      const rows = (body as { csvRows: unknown[] }).csvRows;
      const parsed = rows.map((row, index) => {
        const result = csvReservationRowSchema.safeParse(row);
        return result.success
          ? { index, ok: true as const, data: result.data }
          : { index, ok: false as const, errors: result.error.flatten() };
      });
      return ok({ preview: parsed, validRows: parsed.filter((row) => row.ok).length });
    }

    const input = reservationInputSchema.parse(body);
    const restaurant = await getRestaurant(input.restaurantId);
    if (!restaurant) return Response.json({ ok: false, error: "Restaurant not found" }, { status: 404 });
    const diner = await dinerForInput(input);
    const policy = await getPolicyForRestaurant(restaurant._id);
    const now = isoNow();
    const base: Reservation = {
      _id: id("res"),
      restaurantId: restaurant._id,
      dinerId: diner._id,
      source: input.source,
      date: input.date,
      startTime: input.startTime,
      partySize: input.partySize,
      status: input.status,
      confirmationStatus: input.confirmationStatus,
      reminderOpened: input.reminderOpened,
      priorLateCancellationsAtBooking: input.priorLateCancellationsAtBooking,
      priorNoShowsAtBooking: input.priorNoShowsAtBooking,
      cardOnFile: input.cardOnFile,
      bookedAt: input.bookedAt ?? now,
      highDemandSlot: input.highDemandSlot,
      estimatedRevenue: input.estimatedRevenue || restaurant.averageCheck * input.partySize,
      cancellationFee: input.cancellationFee,
      riskScore: 0,
      riskLevel: "low",
      recommendedAction: "hold",
      createdAt: now,
      updatedAt: now,
    };
    const risk = scoreReservationRisk({ reservation: base, diner, restaurant, policy });
    const reservation = await saveReservation({
      ...base,
      riskScore: risk.score,
      riskLevel: risk.level,
      recommendedAction: risk.recommendedAction,
    });
    await audit({
      actorType: "user",
      actorId: "user_sofia",
      action: "reservation_created",
      entityType: "reservation",
      entityId: reservation._id,
      after: reservation,
    });
    return ok({ reservation, risk });
  } catch (error) {
    return handleApiError(error);
  }
}
