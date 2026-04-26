import { handleApiError, ok } from "@/lib/api";
import { getSession, getSessionUser } from "@/lib/services/session";
import { listRestaurantsByOwner } from "@/lib/repositories/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return ok({ session: null, user: null, restaurants: [] });
    const user = await getSessionUser();
    if (!user) return ok({ session, user: null, restaurants: [] });
    const restaurants =
      user.role === "restaurant_manager" ? await listRestaurantsByOwner(user._id) : [];
    return ok({ session, user, restaurants });
  } catch (error) {
    return handleApiError(error);
  }
}
