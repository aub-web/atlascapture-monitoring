"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { logAudit } from "@/lib/audit";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export type CreateSalesAgentState = { error: string } | null;

export async function createSalesAgent(
  _prevState: CreateSalesAgentState,
  formData: FormData,
): Promise<CreateSalesAgentState> {
  if (!(await isAdminAuthenticated())) {
    return { error: "Admin access required." };
  }

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { error: "Name is required." };
  }

  let agent;
  try {
    agent = await prisma.salesAgent.create({ data: { name } });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "That sales agent already exists." };
    }
    throw err;
  }

  await logAudit("CREATE", "SalesAgent", agent.id, `Added sales agent "${agent.name}"`);

  revalidatePath("/sales/agents");
  revalidatePath("/sales/businesses/new");
  return null;
}
