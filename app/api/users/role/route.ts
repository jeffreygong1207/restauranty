import { handleApiError, ok, readJson } from "@/lib/api";
import { audit } from "@/lib/audit";
import {
  defaultLandingForRole,
  getSession,
  getSessionUser,
  setSession,
  updateUserRole,
} from "@/lib/services/session";
import type { UserRole } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_ROLES: UserRole[] = ["restaurant_manager", "diner", "replacement_diner", "admin"];

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ ok: false, error: "Sign in required" }, { status: 401 });
    const body = await readJson<{ role?: string }>(request);
    if (!body.role || !VALID_ROLES.includes(body.role as UserRole)) {
      return Response.json({ ok: false, error: "Invalid role" }, { status: 400 });
    }
    const role = body.role as UserRole;
    const updated = await updateUserRole(session.userId, role);
    await setSession({ ...session, role });

    const user = await getSessionUser();
    await audit({
      actorType: "user",
      actorId: session.userId,
      action: "user_role_updated",
      entityType: "user",
      entityId: session.userId,
      after: { role },
    });
    return ok({ user: user ?? updated, redirectTo: defaultLandingForRole(role) });
  } catch (error) {
    return handleApiError(error);
  }
}
