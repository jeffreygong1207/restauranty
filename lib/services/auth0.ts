import { env } from "@/lib/env";

export function auth0Configured() {
  return Boolean(env("AUTH0_DOMAIN") && env("AUTH0_CLIENT_ID") && env("AUTH0_CLIENT_SECRET") && env("AUTH0_SECRET"));
}
