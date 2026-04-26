import { cookies } from "next/headers";
import { boolEnv, env, appBaseUrl } from "@/lib/env";
import { getUser, getUserByAuthProviderId, isoNow, saveUser, id } from "@/lib/repositories/store";
import type { User, UserRole } from "@/lib/types";

const COOKIE_NAME = "restauranty_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export type Session = {
  userId: string;
  role: UserRole;
  email: string;
  name: string;
  authProvider: "auth0" | "demo";
};

function encode(session: Session) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

function decode(value: string | undefined): Session | null {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return decode(store.get(COOKIE_NAME)?.value);
}

export async function setSession(session: Session) {
  const store = await cookies();
  store.set(COOKIE_NAME, encode(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const existing = await getUser(session.userId);
  if (existing) return existing;
  const now = isoNow();
  const recovered: User = {
    _id: session.userId,
    authProvider: session.authProvider,
    authProviderId: `${session.authProvider}:${session.email.toLowerCase()}`,
    email: session.email,
    name: session.name,
    role: session.role,
    createdAt: now,
    updatedAt: now,
  };
  return saveUser(recovered);
}

export function isAuth0Configured() {
  return Boolean(
    boolEnv("ENABLE_AUTH0") &&
      env("AUTH0_DOMAIN") &&
      env("AUTH0_CLIENT_ID") &&
      env("AUTH0_CLIENT_SECRET"),
  );
}

export function authLoginUrl(returnTo = "/onboarding") {
  if (!isAuth0Configured()) {
    return `/api/auth/demo-login?returnTo=${encodeURIComponent(returnTo)}`;
  }
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env("AUTH0_CLIENT_ID")!,
    redirect_uri: `${appBaseUrl()}/api/auth/callback`,
    scope: env("AUTH0_SCOPE") ?? "openid profile email",
    state: returnTo,
  });
  const audience = env("AUTH0_AUDIENCE");
  if (audience) params.set("audience", audience);
  return `https://${env("AUTH0_DOMAIN")}/authorize?${params.toString()}`;
}

export function authLogoutUrl(returnTo = "/") {
  if (!isAuth0Configured()) {
    return `/api/auth/demo-logout?returnTo=${encodeURIComponent(returnTo)}`;
  }
  const params = new URLSearchParams({
    client_id: env("AUTH0_CLIENT_ID")!,
    returnTo: `${appBaseUrl()}${returnTo}`,
  });
  return `https://${env("AUTH0_DOMAIN")}/v2/logout?${params.toString()}`;
}

export async function exchangeAuth0Code(code: string) {
  const domain = env("AUTH0_DOMAIN");
  const clientId = env("AUTH0_CLIENT_ID");
  const clientSecret = env("AUTH0_CLIENT_SECRET");
  if (!domain || !clientId || !clientSecret) {
    throw new Error("Auth0 not configured");
  }
  const response = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${appBaseUrl()}/api/auth/callback`,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Auth0 token exchange failed: ${response.status} ${text}`);
  }
  const tokens = (await response.json()) as { id_token?: string; access_token?: string };
  const profile = await fetchAuth0Profile(tokens.access_token);
  return { tokens, profile };
}

async function fetchAuth0Profile(accessToken?: string): Promise<{
  sub: string;
  email?: string;
  name?: string;
  email_verified?: boolean;
}> {
  if (!accessToken) throw new Error("Auth0 access token missing");
  const domain = env("AUTH0_DOMAIN");
  const response = await fetch(`https://${domain}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Auth0 userinfo failed: ${response.status}`);
  }
  return response.json();
}

export async function ensureUserFromAuth0(profile: {
  sub: string;
  email?: string;
  name?: string;
}): Promise<User> {
  const existing = await getUserByAuthProviderId(profile.sub);
  if (existing) return existing;
  const now = isoNow();
  const user: User = {
    _id: id("user"),
    authProvider: "auth0",
    authProviderId: profile.sub,
    email: profile.email ?? `${profile.sub}@restauranty.demo`,
    name: profile.name ?? profile.email ?? "New user",
    role: "diner",
    createdAt: now,
    updatedAt: now,
  };
  return saveUser(user);
}

export async function ensureDemoUser(role: UserRole, email: string, name: string): Promise<User> {
  const providerId = `demo:${email.toLowerCase()}`;
  const existing = await getUserByAuthProviderId(providerId);
  if (existing) return existing;
  const now = isoNow();
  const user: User = {
    _id: id("user"),
    authProvider: "demo",
    authProviderId: providerId,
    email,
    name,
    role,
    createdAt: now,
    updatedAt: now,
  };
  return saveUser(user);
}

export async function updateUserRole(userId: string, role: UserRole) {
  const user = await getUser(userId);
  if (!user) throw new Error("User not found");
  const updated: User = { ...user, role, updatedAt: isoNow() };
  return saveUser(updated);
}

export function defaultLandingForRole(role: UserRole) {
  switch (role) {
    case "restaurant_manager":
      return "/restaurant-dashboard";
    case "diner":
    case "replacement_diner":
      return "/home";
    case "admin":
      return "/admin";
  }
}
