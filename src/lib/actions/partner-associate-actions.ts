"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { logAudit } from "@/lib/audit";

export type CreatePartnerAssociateState = { error: string } | null;

export async function createPartnerAssociate(
  _prevState: CreatePartnerAssociateState,
  formData: FormData,
): Promise<CreatePartnerAssociateState> {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { error: "Name is required." };
  }

  let associate;
  try {
    associate = await prisma.partnerAssociate.create({ data: { name } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "That partner associate already exists." };
    }
    throw err;
  }

  await logAudit(
    "CREATE",
    "PartnerAssociate",
    associate.id,
    `Added partner associate "${associate.name}"`,
  );

  revalidatePath("/associates");
  revalidatePath("/businesses/new");
  return null;
}
