import { prisma } from "@/lib/prisma";

// Despite the name, this fetches every check-in per business (not just the
// latest) so callers can pick "latest within a date range" client-side (see
// Overall Monitoring's date filter) — components that only want the latest
// just read checkIns[0].
export function getBusinessesWithLatestCheckIn() {
  return prisma.business.findMany({
    orderBy: { name: "asc" },
    include: {
      checkIns: {
        orderBy: { checkInDate: "desc" },
      },
      utilizationEntries: {
        orderBy: { date: "desc" },
        take: 1,
      },
      deviceCountHistory: true,
      _count: { select: { checkIns: true } },
    },
  });
}

export function getAllUtilizationEntries() {
  return prisma.utilizationEntry.findMany({
    orderBy: { date: "asc" },
  });
}

// Same as getAllUtilizationEntries but joined with the business name — used
// to build the combined Outbound + Sales weekly-hours chart on Overall
// Monitoring.
export function getAllUtilizationEntriesWithBusinessName() {
  return prisma.utilizationEntry.findMany({
    orderBy: { date: "asc" },
    include: { business: { select: { name: true } } },
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
      deviceCountHistory: true,
    },
  });
}
