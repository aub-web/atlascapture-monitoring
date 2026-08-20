import { prisma } from "@/lib/prisma";

export function getBusinessesWithLatestCheckIn() {
  return prisma.business.findMany({
    orderBy: { name: "asc" },
    include: {
      checkIns: {
        orderBy: { checkInDate: "desc" },
        take: 1,
      },
      utilizationEntries: {
        orderBy: { date: "desc" },
        take: 1,
      },
      _count: { select: { checkIns: true } },
    },
  });
}

export function getAllUtilizationEntries() {
  return prisma.utilizationEntry.findMany({
    orderBy: { date: "asc" },
  });
}

export function getPartnerAssociates() {
  return prisma.partnerAssociate.findMany({ orderBy: { name: "asc" } });
}

export function getCheckIn(id: string) {
  return prisma.checkIn.findUnique({ where: { id } });
}

export function getUtilizationEntry(id: string) {
  return prisma.utilizationEntry.findUnique({ where: { id } });
}

export function getBusinessWithCheckIns(id: string) {
  return prisma.business.findUnique({
    where: { id },
    include: {
      checkIns: { orderBy: { checkInDate: "desc" } },
      utilizationEntries: { orderBy: { date: "desc" } },
    },
  });
}
