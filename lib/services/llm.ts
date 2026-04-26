import { env } from "@/lib/env";

export async function generateLLMExplanation(input: unknown): Promise<string | null> {
  if (env("OPENAI_API_KEY")) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Explain reservation recovery decisions. Do not create business decisions; only summarize the deterministic inputs.",
          },
          { role: "user", content: JSON.stringify(input) },
        ],
        max_tokens: 180,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content ?? null;
    }
  }
  return null;
}
