import { ensureIndexes } from "@/lib/db";
import { integrationStatus, validateEnvironment } from "@/lib/env";
import { handleApiError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await ensureIndexes();
    return ok({
      service: "Restauranty",
      status: "ok",
      database: db,
      env: validateEnvironment(),
      integrations: integrationStatus(),
      time: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
