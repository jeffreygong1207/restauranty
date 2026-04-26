import { ZodError } from "zod";
import { jsonError, RestaurantyError } from "@/lib/errors";

export async function readJson<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new RestaurantyError("Invalid JSON body", 400);
  }
}

export function ok(data: unknown, init?: ResponseInit) {
  return Response.json({ ok: true, ...((data as object) ?? {}) }, init);
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
      { ok: false, error: "Validation failed", details: error.flatten() },
      { status: 400 },
    );
  }
  return jsonError(error);
}
