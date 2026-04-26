import { boolEnv } from "@/lib/env";
import { generateLLMExplanation } from "@/lib/services/llm";
import type { PolicyDecision, RiskResult } from "@/lib/types";

export async function explainRecovery(input: {
  risk: RiskResult;
  policy: PolicyDecision;
  candidateName?: string;
}) {
  if (boolEnv("ENABLE_LLM_EXPLANATIONS")) {
    const llm = await generateLLMExplanation(input);
    if (llm) return llm;
  }
  return `Risk is ${input.risk.score}/100 (${input.risk.level}). Policy ${
    input.policy.allowed ? "allows" : "blocks"
  } recovery, paid resale is ${
    input.policy.paidResaleBlocked ? "blocked" : "allowed"
  }, and the best verified replacement is ${input.candidateName ?? "not selected yet"}.`;
}
