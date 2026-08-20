"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BUSINESS_CATEGORIES, categoryLabel } from "@/lib/constants";
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
