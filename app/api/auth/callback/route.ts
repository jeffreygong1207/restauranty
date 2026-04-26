import { appBaseUrl } from "@/lib/env";
import {
  defaultLandingForRole,
  ensureUserFromAuth0,
  exchangeAuth0Code,
  setSession,
} from "@/lib/services/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnTo = url.searchParams.get("state") ?? "/onboarding";
  if (!code) {
    return Response.redirect(`${appBaseUrl()}/?auth=missing_code`, 302);
  }
  try {
    const { profile } = await exchangeAuth0Code(code);
    const user = await ensureUserFromAuth0({
      sub: profile.sub,
      email: profile.email,
      name: profile.name,
    });
    await setSession({
      userId: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      authProvider: "auth0",
    });
    const target = returnTo.startsWith("/") ? returnTo : defaultLandingForRole(user.role);
    return Response.redirect(`${appBaseUrl()}${target}`, 302);
  } catch (error) {
    const message = encodeURIComponent(error instanceof Error ? error.message : "auth_failed");
    return Response.redirect(`${appBaseUrl()}/?auth=error&message=${message}`, 302);
  }
}
