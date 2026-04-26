import { handleApiError, ok, readJson } from "@/lib/api";
import { audit } from "@/lib/audit";
import { scoreReservationRisk } from "@/lib/agents/riskAgent";
import {
  deleteReservation,
  getDiner,
  getPolicyForRestaurant,
  getReservation,
  getRestaurant,
  saveReservation,
} from "@/lib/repositories/store";
import { reservationInputSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const reservation = await getReservation(id);
    if (!reservation) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    return ok({ reservation });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const reservation = await getReservation(id);
    if (!reservation) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    const body = await readJson<Record<string, unknown>>(request);
    const merged = { ...reservation, ...body };
    const parsed = reservationInputSchema.partial().parse(merged);
    const next = { ...reservation, ...parsed, updatedAt: new Date().toISOString() };
    const [restaurant, diner] = await Promise.all([
      getRestaurant(next.restaurantId),
      getDiner(next.dinerId),
    ]);
    if (restaurant && diner) {
      const policy = await getPolicyForRestaurant(restaurant._id);
      const risk = scoreReservationRisk({ reservation: next, diner, restaurant, policy });
      next.riskScore = risk.score;
      next.riskLevel = risk.level;
      next.recommendedAction = risk.recommendedAction;
    }
    await saveReservation(next);
    await audit({
      actorType: "user",
      actorId: "user_sofia",
      action: "reservation_updated",
      entityType: "reservation",
      entityId: next._id,
      before: reservation,
      after: next,
    });
    return ok({ reservation: next });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await deleteReservation(id);
    await audit({
      actorType: "user",
      actorId: "user_sofia",
      action: "reservation_deleted",
      entityType: "reservation",
      entityId: id,
    });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
