import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categoryLabel, deviceTypeLabel } from "@/lib/constants";
import { formatDate } from "@/lib/date";
import { utilizationHoursForEntry, utilizationPercent } from "@/lib/utilization";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const businesses = await prisma.business.findMany({
    orderBy: { name: "asc" },
    include: { utilizationEntries: { orderBy: { date: "asc" } } },
  });

  const header = [
    "Business",
    "Category",
    "Partner Associate",
    "Date",
    "Device Type",
    "Device Count",
    "Capacity Hours",
    "Recorded Hours",
    "Utilization %",
  ];

  const rows = businesses.flatMap((business) =>
    business.utilizationEntries.map((entry) => {
      const capacityHours = utilizationHoursForEntry(
        entry.deviceType,
        entry.deviceCount,
      );
      const percent = utilizationPercent(entry.recordedHours, capacityHours);
      return [
        business.name,
        categoryLabel(business.category),
        business.partnerAssociate,
        formatDate(entry.date),
        deviceTypeLabel(entry.deviceType),
        entry.deviceCount,
        capacityHours,
        entry.recordedHours,
        percent === null ? "" : percent,
      ];
    }),
  );

  const csv = toCsv([header, ...rows]);
  const filename = `outbound-utilization-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
