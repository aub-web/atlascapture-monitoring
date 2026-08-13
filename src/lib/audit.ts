import { prisma } from "@/lib/prisma";

export type AuditAction = "CREATE" | "DELETE";

export async function logAudit(
  action: AuditAction,
  entityType: string,
  entityId: string,
  summary: string,
): Promise<void> {
  await prisma.auditLogEntry.create({
    data: { action, entityType, entityId, summary },
  });
}
