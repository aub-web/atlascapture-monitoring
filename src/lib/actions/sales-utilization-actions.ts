"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEVICE_TYPES, deviceTypeLabel } from "@/lib/constants";
import { formatDate } from "@/lib/date";
import { utilizationHoursForEntry } from "@/lib/utilization";
import { logAudit } from "@/lib/audit";

export type CreateSalesUtilizationState = { error: string } | null;

export async function createSalesUtilizationEntry(
  _prevState: CreateSalesUtilizationState,
  formData: FormData,
): Promise<CreateSalesUtilizationState> {
  const businessId = String(formData.get("businessId") ?? "");
  const dateValue = String(formData.get("date") ?? "");
  const deviceType = String(formData.get("deviceType") ?? "");
  const deviceCountValue = String(formData.get("deviceCount") ?? "");

  if (!businessId) {
    return { error: "Missing business." };
  }
  if (!dateValue) {
    return { error: "Date is required." };
  }
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { error: "Enter a valid date." };
  }
  if (!DEVICE_TYPES.some((d) => d.value === deviceType)) {
    return { error: "Choose a valid device type." };
  }
  const deviceCount = Number(deviceCountValue);
  if (!Number.isInteger(deviceCount) || deviceCount < 1) {
    return { error: "Device count must be a whole number, 1 or more." };
  }

  const entry = await prisma.salesUtilizationEntry.create({
    data: { businessId, date, deviceType, deviceCount },
    include: { business: { select: { name: true } } },
  });

  await logAudit(
    "CREATE",
    "SalesUtilizationEntry",
    entry.id,
    `Logged ${deviceCount} ${deviceTypeLabel(deviceType)} device(s) (${utilizationHoursForEntry(deviceType, deviceCount)}h) for "${entry.business.name}" on ${formatDate(date)}`,
  );

  revalidatePath(`/sales/businesses/${businessId}`);
  redirect(`/sales/businesses/${businessId}`);
}

export async function deleteSalesUtilizationEntry(
  formData: FormData,
): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const entry = await prisma.salesUtilizationEntry.delete({
    where: { id },
    include: { business: { select: { name: true } } },
  });

  await logAudit(
    "DELETE",
    "SalesUtilizationEntry",
    id,
    `Deleted ${entry.deviceCount} ${deviceTypeLabel(entry.deviceType)} utilization entry for "${entry.business.name}" dated ${formatDate(entry.date)}`,
  );

  revalidatePath(`/sales/businesses/${businessId}`);
  redirect(`/sales/businesses/${businessId}`);
}
