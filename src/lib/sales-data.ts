import { prisma } from "@/lib/prisma";

export function getSalesBusinessesWithUtilization() {
  return prisma.salesBusiness.findMany({
    orderBy: { name: "asc" },
    include: {
      utilizationEntries: true,
      _count: { select: { utilizationEntries: true } },
    },
  });
}

export function getAllSalesUtilizationEntries() {
  return prisma.salesUtilizationEntry.findMany({
    orderBy: { date: "asc" },
  });
}

export function getSalesUtilizationEntry(id: string) {
  return prisma.salesUtilizationEntry.findUnique({ where: { id } });
}

export function getSalesBusinessWithUtilization(id: string) {
  return prisma.salesBusiness.findUnique({
    where: { id },
    include: {
      utilizationEntries: { orderBy: { date: "desc" } },
    },
  });
}
