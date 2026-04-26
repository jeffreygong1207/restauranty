export class RestaurantyError extends Error {
  constructor(
    message: string,
    public status = 400,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function jsonError(error: unknown) {
  const status = error instanceof RestaurantyError ? error.status : 500;
  const message = error instanceof Error ? error.message : "Unexpected error";
  const details = error instanceof RestaurantyError ? error.details : undefined;
  return Response.json({ ok: false, error: message, details }, { status });
}
