import { prisma } from "@/lib/prisma";

export function getAuditLog(limit = 200) {
  return prisma.auditLogEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
