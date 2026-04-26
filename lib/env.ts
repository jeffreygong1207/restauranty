import { ALL_ENV_KEYS, DEFAULT_FLAGS, REQUIRED_ENV } from "./constants";

type FlagKey = keyof typeof DEFAULT_FLAGS;

function raw(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export function env(key: (typeof ALL_ENV_KEYS)[number]): string | undefined {
  return raw(key);
}

export function boolEnv(key: FlagKey): boolean {
  const value = raw(key);
  if (!value) return DEFAULT_FLAGS[key];
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function normalizeBaseUrl(value: string | undefined) {
  if (!value) return undefined;
  const protocol = /^(localhost|127\.0\.0\.1|\[::1\])(?::|$)/.test(value) ? "http" : "https";
  const withProtocol = /^https?:\/\//i.test(value) ? value : `${protocol}://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

function isLocalBaseUrl(value: string | undefined) {
  return Boolean(value && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::|\/|$)/i.test(value));
}

export function appBaseUrl() {
  const configured = normalizeBaseUrl(raw("APP_BASE_URL")) ?? normalizeBaseUrl(raw("NEXT_PUBLIC_APP_URL"));
  const vercel = normalizeBaseUrl(raw("VERCEL_PROJECT_PRODUCTION_URL")) ?? normalizeBaseUrl(raw("VERCEL_URL"));
  if (isLocalBaseUrl(configured) && vercel) return vercel;
  return configured ?? vercel ?? "http://localhost:3000";
}

export function hasMongoConfig() {
  return Boolean(raw("MONGODB_URI") && raw("MONGODB_DB"));
}

export function integrationStatus() {
  const has = (keys: string[]) => keys.every((key) => Boolean(raw(key)));
  return [
    {
      provider: "mongodb",
      label: "MongoDB Atlas",
      enabled: true,
      configured: has(["MONGODB_URI", "MONGODB_DB"]),
    },
    {
      provider: "google_places",
      label: "Google Places",
      enabled: boolEnv("ENABLE_GOOGLE_PLACES"),
      configured: has(["GOOGLE_MAPS_API_KEY"]),
    },
    {
      provider: "auth0",
      label: "Auth0",
      enabled: boolEnv("ENABLE_AUTH0"),
      configured: has(["AUTH0_DOMAIN", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET", "AUTH0_SECRET"]),
    },
    {
      provider: "world_id",
      label: "World ID",
      enabled: boolEnv("ENABLE_WORLD_ID"),
      configured: has(["WORLD_ID_APP_ID", "WORLD_ID_ACTION_ID", "WORLD_ID_SECRET_KEY"]),
    },
    {
      provider: "twilio",
      label: "Twilio",
      enabled: boolEnv("ENABLE_REAL_SMS"),
      configured: has(["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"]),
    },
    {
      provider: "agentverse",
      label: "Fetch.ai Agentverse",
      enabled: boolEnv("ENABLE_AGENTVERSE_CHAT"),
      configured: has(["FETCH_AGENTVERSE_KEY", "AGENTVERSE_MAILBOX_KEY"]),
    },
    {
      provider: "openai",
      label: "OpenAI",
      enabled: boolEnv("ENABLE_LLM_EXPLANATIONS"),
      configured: has(["OPENAI_API_KEY"]),
    },
    {
      provider: "anthropic",
      label: "Anthropic",
      enabled: boolEnv("ENABLE_LLM_EXPLANATIONS"),
      configured: has(["ANTHROPIC_API_KEY"]),
    },
    {
      provider: "gemma",
      label: "Gemma",
      enabled: boolEnv("ENABLE_LLM_EXPLANATIONS"),
      configured: has(["GOOGLE_API_KEY"]) || has(["GEMMA_API_KEY"]),
    },
    {
      provider: "elevenlabs",
      label: "ElevenLabs",
      enabled: boolEnv("ENABLE_ELEVENLABS"),
      configured: has(["ELEVENLABS_API_KEY", "ELEVENLABS_VOICE_ID"]),
    },
    {
      provider: "cloudinary",
      label: "Cloudinary",
      enabled: boolEnv("ENABLE_CLOUDINARY"),
      configured: has(["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]),
    },
  ] as const;
}

export function validateEnvironment() {
  const missingRequired = REQUIRED_ENV.filter((key) => !raw(key));
  const configured = ALL_ENV_KEYS.filter((key) => Boolean(raw(key)));
  return {
    missingRequired,
    configured,
    mode: missingRequired.length === 0 ? "atlas-ready" : "demo-fallback",
  };
}
