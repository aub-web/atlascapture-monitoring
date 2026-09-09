"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEVICE_TYPES } from "@/lib/constants";
import { computeExpectedHours } from "@/lib/hours";
import { formatDate } from "@/lib/date";
import { logAudit } from "@/lib/audit";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export type CreateSalesCheckInState = { error: string } | null;

function optionalText(value: FormDataEntryValue | null): string | null {
  const trimmed = String(value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

export async function createSalesCheckIn(
  _prevState: CreateSalesCheckInState,
  formData: FormData,
): Promise<CreateSalesCheckInState> {
  const businessId = String(formData.get("businessId") ?? "");
  const checkInDateValue = String(formData.get("checkInDate") ?? "");
  const recordingsCountValue = String(formData.get("recordingsCount") ?? "");
  const startTime = String(formData.get("startTime") ?? "").trim();
  const stopTime = String(formData.get("stopTime") ?? "").trim();
  const deviceType = String(formData.get("deviceType") ?? "");

  if (!businessId) {
    return { error: "Missing business." };
  }
  if (!checkInDateValue) {
    return { error: "Check-in date is required." };
  }

  const checkInDate = new Date(`${checkInDateValue}T00:00:00`);
  if (Number.isNaN(checkInDate.getTime())) {
    return { error: "Enter a valid check-in date." };
  }

  const recordingsCount = Number(recordingsCountValue);
  if (!Number.isInteger(recordingsCount) || recordingsCount < 0) {
    return { error: "Number of recorders must be a whole number, 0 or more." };
  }

  if (!startTime || !stopTime) {
    return { error: "Start and stop time are required." };
  }

  const expectedHours = computeExpectedHours(startTime, stopTime);
  if (expectedHours === null) {
    return { error: "Stop time must be after start time." };
  }

  if (!DEVICE_TYPES.some((d) => d.value === deviceType)) {
    return { error: "Choose a valid device type." };
  }

  const checkIn = await prisma.salesCheckIn.create({
    data: {
      businessId,
      checkInDate,
      recordingsCount,
      expectedHours,
      startTime,
      stopTime,
      deviceType,
      whatWentWrong: optionalText(formData.get("whatWentWrong")),
      whatNeedsImprovement: optionalText(formData.get("whatNeedsImprovement")),
    },
    include: { business: { select: { name: true } } },
  });

  await logAudit(
    "CREATE",
    "SalesCheckIn",
    checkIn.id,
    `Logged check-in for "${checkIn.business.name}" on ${formatDate(checkInDate)}`,
  );

  revalidatePath(`/sales/businesses/${businessId}`);
  revalidatePath("/sales");
  redirect(`/sales/businesses/${businessId}`);
}

export type UpdateSalesCheckInState = { error: string } | null;

export async function updateSalesCheckIn(
  _prevState: UpdateSalesCheckInState,
  formData: FormData,
): Promise<UpdateSalesCheckInState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Admin access required." };
  }

  const id = String(formData.get("id") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const checkInDateValue = String(formData.get("checkInDate") ?? "");
  const recordingsCountValue = String(formData.get("recordingsCount") ?? "");
  const startTime = String(formData.get("startTime") ?? "").trim();
  const stopTime = String(formData.get("stopTime") ?? "").trim();
  const deviceType = String(formData.get("deviceType") ?? "");

  if (!checkInDateValue) {
    return { error: "Check-in date is required." };
  }
  const checkInDate = new Date(`${checkInDateValue}T00:00:00`);
  if (Number.isNaN(checkInDate.getTime())) {
    return { error: "Enter a valid check-in date." };
  }
  const recordingsCount = Number(recordingsCountValue);
  if (!Number.isInteger(recordingsCount) || recordingsCount < 0) {
    return { error: "Number of recorders must be a whole number, 0 or more." };
  }
  if (!startTime || !stopTime) {
    return { error: "Start and stop time are required." };
  }
  const expectedHours = computeExpectedHours(startTime, stopTime);
  if (expectedHours === null) {
    return { error: "Stop time must be after start time." };
  }
  if (!DEVICE_TYPES.some((d) => d.value === deviceType)) {
    return { error: "Choose a valid device type." };
  }

  const checkIn = await prisma.salesCheckIn.update({
    where: { id },
    data: {
      checkInDate,
      recordingsCount,
      expectedHours,
      startTime,
      stopTime,
      deviceType,
      whatWentWrong: optionalText(formData.get("whatWentWrong")),
      whatNeedsImprovement: optionalText(formData.get("whatNeedsImprovement")),
    },
    include: { business: { select: { name: true } } },
  });

  await logAudit(
    "UPDATE",
    "SalesCheckIn",
    checkIn.id,
    `Edited check-in for "${checkIn.business.name}" dated ${formatDate(checkInDate)}`,
  );

  revalidatePath(`/sales/businesses/${businessId}`);
  revalidatePath("/sales");
  redirect(`/sales/businesses/${businessId}`);
}

export async function deleteSalesCheckIn(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const checkIn = await prisma.salesCheckIn.delete({
    where: { id },
    include: { business: { select: { name: true } } },
  });

  await logAudit(
    "DELETE",
    "SalesCheckIn",
    id,
    `Deleted check-in for "${checkIn.business.name}" dated ${formatDate(checkIn.checkInDate)}`,
  );

  revalidatePath(`/sales/businesses/${businessId}`);
  revalidatePath("/sales");
  redirect(`/sales/businesses/${businessId}`);
}
