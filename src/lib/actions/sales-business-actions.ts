"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { BUSINESS_STATUSES, businessStatusLabel } from "@/lib/constants";

async function isValidSalesAgent(name: string): Promise<boolean> {
  if (!name) return false;
  const match = await prisma.salesAgent.findUnique({ where: { name } });
  return match !== null;
}

export type CreateSalesBusinessState = { error: string } | null;

export async function createSalesBusiness(
  _prevState: CreateSalesBusinessState,
  formData: FormData,
): Promise<CreateSalesBusinessState> {
  const name = String(formData.get("name") ?? "").trim();
  const salesAgent = String(formData.get("salesAgent") ?? "");

  if (!name) {
    return { error: "Business name is required." };
  }
  if (!(await isValidSalesAgent(salesAgent))) {
    return { error: "Choose a valid sales agent." };
  }

  const business = await prisma.salesBusiness.create({
    data: { name, salesAgent },
  });

  await logAudit(
    "CREATE",
    "SalesBusiness",
    business.id,
    `Created sales business "${business.name}" (${salesAgent})`,
  );

  revalidatePath("/sales");
  redirect(`/sales/businesses/${business.id}`);
}

export type UpdateSalesBusinessState = { error: string } | null;

export async function updateSalesBusiness(
  _prevState: UpdateSalesBusinessState,
  formData: FormData,
): Promise<UpdateSalesBusinessState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Admin access required." };
  }

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const salesAgent = String(formData.get("salesAgent") ?? "");

  if (!name) {
    return { error: "Business name is required." };
  }
  if (!(await isValidSalesAgent(salesAgent))) {
    return { error: "Choose a valid sales agent." };
  }

  const business = await prisma.salesBusiness.update({
    where: { id },
    data: { name, salesAgent },
  });

  await logAudit(
    "UPDATE",
    "SalesBusiness",
    business.id,
    `Edited sales business "${business.name}" (${salesAgent})`,
  );

  revalidatePath("/sales");
  revalidatePath(`/sales/businesses/${id}`);
  redirect(`/sales/businesses/${id}`);
}

export async function updateSalesBusinessStatus(
  formData: FormData,
): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!BUSINESS_STATUSES.some((s) => s.value === status)) {
    throw new Error("Invalid status.");
  }

  const business = await prisma.salesBusiness.update({
    where: { id },
    data: { status },
  });

  await logAudit(
    "UPDATE",
    "SalesBusiness",
    business.id,
    `Marked sales business "${business.name}" as ${businessStatusLabel(status)}`,
  );

  revalidatePath("/sales");
  revalidatePath(`/sales/businesses/${id}`);
  redirect(`/sales/businesses/${id}`);
}

export async function updateSalesBusinessNotes(
  formData: FormData,
): Promise<void> {
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

  const business = await prisma.salesBusiness.update({ where: { id }, data });

  await logAudit(
    "UPDATE",
    "SalesBusiness",
    business.id,
    `Updated notes for "${business.name}"`,
  );

  revalidatePath("/sales");
  revalidatePath("/overall");
  revalidatePath(`/sales/businesses/${id}`);
}

const DEVICE_COUNT_FIELDS = [
  "issuedMonoCount",
  "issuedMulticamCount",
  "issuedMonoInsta360Count",
  "defectiveMonoCount",
  "defectiveMulticamCount",
  "defectiveMonoInsta360Count",
] as const;

// Maps each pair of count fields to the device type value used by
// SalesDeviceCountSnapshot — see src/lib/utilization.ts.
const DEVICE_TYPE_FIELDS = [
  { type: "MONO", issued: "issuedMonoCount", defective: "defectiveMonoCount" },
  { type: "MULTICAM", issued: "issuedMulticamCount", defective: "defectiveMulticamCount" },
  { type: "MONO_INSTA360", issued: "issuedMonoInsta360Count", defective: "defectiveMonoInsta360Count" },
] as const;

export async function updateSalesBusinessDevices(
  formData: FormData,
): Promise<void> {
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

  const business = await prisma.salesBusiness.update({ where: { id }, data });

  // Snapshot the new issued/defective counts, dated now, for every device
  // type this edit touched — so past periods stay judged against what was
  // issued at the time, not this new value. See effectiveDevicesAt.
  const changedTypes = DEVICE_TYPE_FIELDS.filter(
    (t) => t.issued in data || t.defective in data,
  );
  if (changedTypes.length > 0) {
    await prisma.salesDeviceCountSnapshot.createMany({
      data: changedTypes.map((t) => ({
        businessId: id,
        deviceType: t.type,
        issuedCount: business[t.issued],
        defectiveCount: business[t.defective],
        effectiveAt: new Date(),
      })),
    });
  }

  await logAudit(
    "UPDATE",
    "SalesBusiness",
    business.id,
    `Updated device allocation for "${business.name}"`,
  );

  revalidatePath("/sales");
  revalidatePath("/overall");
  revalidatePath(`/sales/businesses/${id}`);
}

export async function deleteSalesBusiness(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const business = await prisma.salesBusiness.delete({ where: { id } });

  await logAudit(
    "DELETE",
    "SalesBusiness",
    id,
    `Deleted sales business "${business.name}" (${business.salesAgent})`,
  );

  revalidatePath("/sales");
  redirect("/sales");
}
