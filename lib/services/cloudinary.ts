import crypto from "node:crypto";
import { boolEnv, env } from "@/lib/env";

export function cloudinarySignature(params: Record<string, string | number>) {
  if (!boolEnv("ENABLE_CLOUDINARY") || !env("CLOUDINARY_API_SECRET")) {
    return { configured: false, signature: null };
  }
  const toSign = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return {
    configured: true,
    signature: crypto.createHash("sha1").update(`${toSign}${env("CLOUDINARY_API_SECRET")}`).digest("hex"),
  };
}
