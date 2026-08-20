"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { isAdminAuthenticated } from "@/lib/admin-auth";

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
