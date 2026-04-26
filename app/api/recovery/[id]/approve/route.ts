import { handleApiError, ok } from "@/lib/api";
import { settleRecovery } from "@/lib/agents/settlementAgent";
import { canApproveRecovery } from "@/lib/agents/restaurantAgent";
import {
  getDiner,
  getPolicyForRestaurant,
  getRecoveryRequestByReservation,
  getReservation,
  listWaitlistCandidates,
  saveRecoveryRequest,
} from "@/lib/repositories/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const role = request.headers.get("x-restauranty-role") ?? "restaurant_manager";
    if (!canApproveRecovery(role as never)) {
      return Response.json({ ok: false, error: "Manager or admin role required" }, { status: 403 });
    }
    const reservation = await getReservation(id);
    if (!reservation) return Response.json({ ok: false, error: "Reservation not found" }, { status: 404 });
    const requestRecord = await getRecoveryRequestByReservation(id);
    if (!requestRecord?.selectedReplacementDinerId) {
      return Response.json({ ok: false, error: "No selected replacement diner" }, { status: 400 });
    }
    const policy = await getPolicyForRestaurant(reservation.restaurantId);
    const diner = await getDiner(requestRecord.selectedReplacementDinerId);
    const candidate = (await listWaitlistCandidates(reservation.restaurantId)).find(
      (item) => item.dinerId === diner?._id,
    );
    if (!candidate) return Response.json({ ok: false, error: "Selected candidate not found" }, { status: 404 });
    const settlement = await settleRecovery({ reservation, candidate, policy, request: requestRecord });
    const recoveryRequest = await saveRecoveryRequest({
      ...requestRecord,
      status: "recovered",
      feeWaived: settlement.feeWaived,
      revenueProtected: settlement.revenueProtected,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return ok({ recoveryRequest, settlement });
  } catch (error) {
    return handleApiError(error);
  }
}
