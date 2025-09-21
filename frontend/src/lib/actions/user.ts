"use server";

import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function updateProfileAction(input: { name?: string; image?: string }) {
  try {
    const userId = await requireUserId();
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: input.name,
        image: input.image,
      },
    });
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("updateProfileAction", error);
    return { success: false, error: "Unable to update profile" };
  }
}

export async function deleteAccountAction() {
  try {
    const userId = await requireUserId();
    await prisma.user.delete({ where: { id: userId } });
    return { success: true };
  } catch (error) {
    console.error("deleteAccountAction", error);
    return { success: false, error: "Unable to delete account" };
  }
}
