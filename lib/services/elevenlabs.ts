import { boolEnv, env } from "@/lib/env";

export async function generateVoiceSummary(text: string) {
  if (!boolEnv("ENABLE_ELEVENLABS") || !env("ELEVENLABS_API_KEY") || !env("ELEVENLABS_VOICE_ID")) {
    return { status: "skipped", reason: "ElevenLabs not configured" };
  }
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${env("ELEVENLABS_VOICE_ID")}`, {
    method: "POST",
    headers: {
      "xi-api-key": env("ELEVENLABS_API_KEY")!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
  });
  if (!response.ok) return { status: "failed", statusCode: response.status };
  return { status: "generated", contentType: response.headers.get("content-type") };
}
