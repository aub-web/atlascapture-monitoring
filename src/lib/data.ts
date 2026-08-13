import { prisma } from "@/lib/prisma";

export function getBusinessesWithLatestCheckIn() {
  return prisma.business.findMany({
    orderBy: { name: "asc" },
    include: {
      checkIns: {
        orderBy: { checkInDate: "desc" },
        take: 1,
      },
      _count: { select: { checkIns: true } },
    },
  });
}

export function getBusinessWithCheckIns(id: string) {
  return prisma.business.findUnique({
    where: { id },
    include: {
      checkIns: { orderBy: { checkInDate: "desc" } },
    },
  });
}
