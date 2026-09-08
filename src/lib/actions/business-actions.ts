"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BUSINESS_CATEGORIES, BUSINESS_STATUSES, categoryLabel, businessStatusLabel } from "@/lib/constants";
import { logAudit } from "@/lib/audit";
import { isAdminAuthenticated } from "@/lib/admin-auth";

async function isValidPartnerAssociate(name: string): Promise<boolean> {
  if (!name) return false;
  const match = await prisma.partnerAssociate.findUnique({ where: { name } });
  return match !== null;
}

export type CreateBusinessState = { error: string } | null;

export async function createBusiness(
  _prevState: CreateBusinessState,
  formData: FormData,
): Promise<CreateBusinessState> {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const partnerAssociate = String(formData.get("partnerAssociate") ?? "");

  if (!name) {
    return { error: "Business name is required." };
  }
  if (!BUSINESS_CATEGORIES.some((c) => c.value === category)) {
    return { error: "Choose a valid category." };
  }
  if (!(await isValidPartnerAssociate(partnerAssociate))) {
    return { error: "Choose a valid partner associate." };
  }

  const business = await prisma.business.create({
    data: { name, category, partnerAssociate },
  });

  await logAudit(
    "CREATE",
    "Business",
    business.id,
    `Created business "${business.name}" (${categoryLabel(category)}, ${partnerAssociate})`,
  );

  revalidatePath("/");
  redirect(`/businesses/${business.id}`);
}

export type UpdateBusinessState = { error: string } | null;

export async function updateBusiness(
  _prevState: UpdateBusinessState,
  formData: FormData,
): Promise<UpdateBusinessState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Admin access required." };
  }

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const partnerAssociate = String(formData.get("partnerAssociate") ?? "");

  if (!name) {
    return { error: "Business name is required." };
  }
  if (!BUSINESS_CATEGORIES.some((c) => c.value === category)) {
    return { error: "Choose a valid category." };
  }
  if (!(await isValidPartnerAssociate(partnerAssociate))) {
    return { error: "Choose a valid partner associate." };
  }

  const business = await prisma.business.update({
    where: { id },
    data: { name, category, partnerAssociate },
  });

  await logAudit(
    "UPDATE",
    "Business",
    business.id,
    `Edited business "${business.name}" (${categoryLabel(category)}, ${partnerAssociate})`,
  );

  revalidatePath("/");
  revalidatePath(`/businesses/${id}`);
  redirect(`/businesses/${id}`);
}

export async function updateBusinessStatus(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!BUSINESS_STATUSES.some((s) => s.value === status)) {
    throw new Error("Invalid status.");
  }

  const business = await prisma.business.update({
    where: { id },
    data: { status },
  });

  await logAudit(
    "UPDATE",
    "Business",
    business.id,
    `Marked business "${business.name}" as ${businessStatusLabel(status)}`,
  );

  revalidatePath("/");
  revalidatePath(`/businesses/${id}`);
  redirect(`/businesses/${id}`);
}

export async function updateBusinessNotes(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const data: { qcFeedback?: string | null; remarks?: string | null } = {};
  if (formData.has("qcFeedback")) {
    const value = String(formData.get("qcFeedback") ?? "").trim();
    data.qcFeedback = value === "" ? null : value;
  }
  if (formData.has("remarks")) {
    const value = String(formData.get("remarks") ?? "").trim();
    data.remarks = value === "" ? null : value;
  }
  if (Object.keys(data).length === 0) return;

  const business = await prisma.business.update({ where: { id }, data });

  await logAudit(
    "UPDATE",
    "Business",
    business.id,
    `Updated notes for "${business.name}"`,
  );

  revalidatePath("/");
  revalidatePath("/overall");
  revalidatePath(`/businesses/${id}`);
}

const DEVICE_COUNT_FIELDS = [
  "issuedMonoCount",
  "issuedMulticamCount",
  "defectiveMonoCount",
  "defectiveMulticamCount",
] as const;

export async function updateBusinessDevices(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const data: Record<string, number> = {};
  for (const field of DEVICE_COUNT_FIELDS) {
    if (!formData.has(field)) continue;
    const value = Number(formData.get(field));
    if (!Number.isInteger(value) || value < 0) continue;
    data[field] = value;
  }
  if (Object.keys(data).length === 0) return;

  const business = await prisma.business.update({ where: { id }, data });

  await logAudit(
    "UPDATE",
    "Business",
    business.id,
    `Updated device allocation for "${business.name}"`,
  );

  revalidatePath("/");
  revalidatePath("/overall");
  revalidatePath(`/businesses/${id}`);
}

export async function deleteBusiness(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const business = await prisma.business.delete({ where: { id } });

  await logAudit(
    "DELETE",
    "Business",
    id,
    `Deleted business "${business.name}" (${categoryLabel(business.category)}, ${business.partnerAssociate})`,
  );

  revalidatePath("/");
  redirect("/");
}
