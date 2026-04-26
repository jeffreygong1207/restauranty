import { appBaseUrl } from "@/lib/env";
import {
  defaultLandingForRole,
  ensureDemoUser,
  setSession,
} from "@/lib/services/session";
import type { UserRole } from "@/lib/types";

export const dynamic = "force-dynamic";

const DEMO_USERS: Array<{ email: string; name: string; role: UserRole }> = [
  { email: "sofia@restauranty.demo", name: "Sofia Martinez", role: "restaurant_manager" },
  { email: "daniel@restauranty.demo", name: "Daniel Park", role: "diner" },
  { email: "maya@restauranty.demo", name: "Maya Chen", role: "replacement_diner" },
  { email: "admin@restauranty.demo", name: "Admin Demo", role: "admin" },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const role = (url.searchParams.get("role") ?? "restaurant_manager") as UserRole;
  const returnTo = url.searchParams.get("returnTo") ?? "/onboarding";
  const seed = DEMO_USERS.find((d) => d.role === role) ?? DEMO_USERS[0];
  const user = await ensureDemoUser(seed.role, seed.email, seed.name);
  await setSession({
    userId: user._id,
    role: user.role,
    email: user.email,
    name: user.name,
    authProvider: "demo",
  });
  const target = returnTo.startsWith("/") ? returnTo : defaultLandingForRole(user.role);
  return Response.redirect(`${appBaseUrl()}${target}`, 302);
}

export async function POST(request: Request) {
  return GET(request);
}
