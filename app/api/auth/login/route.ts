import { authLoginUrl } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo") ?? "/onboarding";
  return Response.redirect(authLoginUrl(returnTo), 302);
}
