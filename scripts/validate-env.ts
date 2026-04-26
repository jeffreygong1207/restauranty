import { loadEnvConfig } from "@next/env";
import { integrationStatus, validateEnvironment } from "@/lib/env";

loadEnvConfig(process.cwd());

const result = validateEnvironment();
console.log(`Restauranty env mode: ${result.mode}`);
if (result.missingRequired.length) {
  console.log(`Missing production database vars: ${result.missingRequired.join(", ")}`);
  console.log("The app will use seeded demo fallbacks until MongoDB Atlas is configured.");
}
console.table(
  integrationStatus().map((item) => ({
    provider: item.provider,
    enabled: item.enabled,
    configured: item.configured,
  })),
);
