import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  categoryLabel,
  deviceTypeLabel,
  businessStatusLabel,
  recordingStatusLabel,
} from "@/lib/constants";
import { formatDate } from "@/lib/date";
import {
  capacityHoursForDeviceType,
  effectiveDevicesAt,
  utilizationPercent,
} from "@/lib/utilization";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const businesses = await prisma.business.findMany({
    orderBy: { name: "asc" },
    include: {
      utilizationEntries: { orderBy: { date: "asc" } },
      deviceCountHistory: true,
    },
  });

  const header = [
    "Business",
    "Status",
    "Category",
    "Partner Associate",
    "Date",
    "Device Type",
    "Device Count",
    "Issued Devices",
    "Capacity Hours",
    "Recorded Hours",
    "Utilization %",
    "Recording Status",
    "QC Feedback",
    "Remarks",
  ];

  const rows = businesses.flatMap((business) => {
    return business.utilizationEntries.map((entry) => {
      const effectiveDevices = effectiveDevicesAt(
        business.deviceCountHistory,
        entry.date,
      );
      const capacityHours = capacityHoursForDeviceType(
        effectiveDevices,
        entry.deviceType,
      );
      const percent = utilizationPercent(entry.recordedHours, capacityHours);
      return [
        business.name,
        businessStatusLabel(business.status),
        categoryLabel(business.category),
        business.partnerAssociate,
        formatDate(entry.date),
        deviceTypeLabel(entry.deviceType),
        entry.deviceCount,
        effectiveDevices[entry.deviceType] ?? 0,
        capacityHours,
        entry.recordedHours,
        percent === null ? "" : percent,
        recordingStatusLabel(entry.recordingStatus),
        business.qcFeedback ?? "",
        business.remarks ?? "",
      ];
    });
  });

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
