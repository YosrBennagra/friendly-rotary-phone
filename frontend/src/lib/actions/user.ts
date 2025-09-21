"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateProfileAction(input: { name?: string; image?: string }) {
  try {
    const user = await requireAuth();
    
    // For now, return success since we're working with demo data
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("updateProfileAction", error);
    return { success: false, error: "Unable to update profile" };
  }
}

export async function deleteAccountAction() {
  try {
    const user = await requireAuth();
    
    // For now, return success since we're working with demo data
    return { success: true };
  } catch (error) {
    console.error("deleteAccountAction", error);
    return { success: false, error: "Unable to delete account" };
  }
}
