import { authLogoutUrl, clearSession } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") ?? "/";
  await clearSession();
  return Response.redirect(authLogoutUrl(returnTo), 302);
}
