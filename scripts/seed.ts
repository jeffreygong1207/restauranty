import { loadEnvConfig } from "@next/env";
import { seedDatabase } from "@/lib/repositories/store";

loadEnvConfig(process.cwd());

async function main() {
  const result = await seedDatabase();
  console.log(`Seed complete: ${JSON.stringify(result)}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
