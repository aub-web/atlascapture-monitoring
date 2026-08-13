"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEVICE_TYPES } from "@/lib/constants";

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

  await prisma.salesUtilizationEntry.create({
    data: { businessId, date, deviceType, deviceCount },
  });

  revalidatePath(`/sales/businesses/${businessId}`);
  redirect(`/sales/businesses/${businessId}`);
}

export async function deleteSalesUtilizationEntry(
  formData: FormData,
): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  await prisma.salesUtilizationEntry.delete({ where: { id } });
  revalidatePath(`/sales/businesses/${businessId}`);
  redirect(`/sales/businesses/${businessId}`);
}
