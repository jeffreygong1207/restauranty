import { addAuditLog } from "@/lib/repositories/auditLogs";
import type { AuditLog } from "@/lib/types";

export async function audit(input: Omit<AuditLog, "_id" | "createdAt">) {
  return addAuditLog(input);
}
