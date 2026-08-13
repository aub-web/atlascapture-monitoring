"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DEVICE_TYPES } from "@/lib/constants";
import { computeExpectedHours } from "@/lib/hours";

export type CreateCheckInState = { error: string } | null;

function optionalText(value: FormDataEntryValue | null): string | null {
  const trimmed = String(value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

export async function createCheckIn(
  _prevState: CreateCheckInState,
  formData: FormData,
): Promise<CreateCheckInState> {
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
    return { error: "Recordings count must be a whole number, 0 or more." };
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

  await prisma.checkIn.create({
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
  });

  revalidatePath(`/businesses/${businessId}`);
  revalidatePath("/");
  redirect(`/businesses/${businessId}`);
}

export async function deleteCheckIn(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  await prisma.checkIn.delete({ where: { id } });
  revalidatePath(`/businesses/${businessId}`);
  revalidatePath("/");
  redirect(`/businesses/${businessId}`);
}
