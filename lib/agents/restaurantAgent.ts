import { audit } from "@/lib/audit";
import type { RecoveryRequest, UserRole } from "@/lib/types";

export async function requestManagerApproval(recoveryRequest: RecoveryRequest) {
  await audit({
    actorType: "agent",
    actorId: "RestaurantAgent",
    action: "manager_approval_requested",
    entityType: "recoveryRequest",
    entityId: recoveryRequest._id,
    after: { status: "manager_approval_required" },
  });
  return {
    status: "manager_approval_required" as const,
    message: "Manager approval required before refilling the table.",
  };
}

export function canApproveRecovery(role: UserRole) {
  return role === "restaurant_manager" || role === "admin";
}
