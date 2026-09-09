import { prisma } from "@/lib/prisma";

export function getSalesBusinessesWithUtilization() {
  return prisma.salesBusiness.findMany({
    orderBy: { name: "asc" },
    include: {
      utilizationEntries: { orderBy: { date: "desc" } },
      deviceCountHistory: true,
      _count: { select: { utilizationEntries: true } },
    },
  });
}

export function getAllSalesUtilizationEntries() {
  return prisma.salesUtilizationEntry.findMany({
    orderBy: { date: "asc" },
  });
}

// Same as getAllSalesUtilizationEntries but joined with the business name —
// used to build the combined Outbound + Sales weekly-hours chart on Overall
// Monitoring.
export function getAllSalesUtilizationEntriesWithBusinessName() {
  return prisma.salesUtilizationEntry.findMany({
    orderBy: { date: "asc" },
    include: { business: { select: { name: true } } },
  });
}

export function getSalesAgents() {
  return prisma.salesAgent.findMany({ orderBy: { name: "asc" } });
}

export function getSalesUtilizationEntry(id: string) {
  return prisma.salesUtilizationEntry.findUnique({ where: { id } });
}

export function getSalesBusinessWithUtilization(id: string) {
  return prisma.salesBusiness.findUnique({
    where: { id },
    include: {
      utilizationEntries: { orderBy: { date: "desc" } },
      deviceCountHistory: true,
    },
  });
}
