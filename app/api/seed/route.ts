import { seedDatabase } from "@/lib/repositories/store";
import { handleApiError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const result = await seedDatabase();
    return ok({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
