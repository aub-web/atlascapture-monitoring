"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SALES_AGENTS } from "@/lib/constants";

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
  if (!SALES_AGENTS.includes(salesAgent as (typeof SALES_AGENTS)[number])) {
    return { error: "Choose a valid sales agent." };
  }

  const business = await prisma.salesBusiness.create({
    data: { name, salesAgent },
  });

  revalidatePath("/sales");
  redirect(`/sales/businesses/${business.id}`);
}

export async function deleteSalesBusiness(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  await prisma.salesBusiness.delete({ where: { id } });
  revalidatePath("/sales");
  redirect("/sales");
}
