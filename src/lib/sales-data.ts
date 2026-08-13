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

export function getSalesBusinessWithUtilization(id: string) {
  return prisma.salesBusiness.findUnique({
    where: { id },
    include: {
      utilizationEntries: { orderBy: { date: "desc" } },
    },
  });
}
