"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEVICE_TYPES, deviceTypeLabel } from "@/lib/constants";
import { formatDate } from "@/lib/date";
import { utilizationHoursForEntry } from "@/lib/utilization";
import { logAudit } from "@/lib/audit";

export type CreateUtilizationState = { error: string } | null;

export async function createUtilizationEntry(
  _prevState: CreateUtilizationState,
  formData: FormData,
): Promise<CreateUtilizationState> {
  const businessId = String(formData.get("businessId") ?? "");
  const dateValue = String(formData.get("date") ?? "");
  const deviceType = String(formData.get("deviceType") ?? "");
  const deviceCountValue = String(formData.get("deviceCount") ?? "");
  const recordedHoursValue = String(formData.get("recordedHours") ?? "");

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
  const recordedHours = Number(recordedHoursValue);
  if (!Number.isFinite(recordedHours) || recordedHours < 0) {
    return { error: "Recorded hours must be a number, 0 or more." };
  }

  const entry = await prisma.utilizationEntry.create({
    data: { businessId, date, deviceType, deviceCount, recordedHours },
    include: { business: { select: { name: true } } },
  });

  await logAudit(
    "CREATE",
    "UtilizationEntry",
    entry.id,
    `Logged ${deviceCount} ${deviceTypeLabel(deviceType)} device(s), ${recordedHours}h recorded (of ${utilizationHoursForEntry(deviceType, deviceCount)}h capacity) for "${entry.business.name}" on ${formatDate(date)}`,
  );

  revalidatePath(`/businesses/${businessId}`);
  redirect(`/businesses/${businessId}`);
}

export async function deleteUtilizationEntry(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const entry = await prisma.utilizationEntry.delete({
    where: { id },
    include: { business: { select: { name: true } } },
  });

  await logAudit(
    "DELETE",
    "UtilizationEntry",
    id,
    `Deleted ${entry.deviceCount} ${deviceTypeLabel(entry.deviceType)} utilization entry for "${entry.business.name}" dated ${formatDate(entry.date)}`,
  );

  revalidatePath(`/businesses/${businessId}`);
  redirect(`/businesses/${businessId}`);
}
