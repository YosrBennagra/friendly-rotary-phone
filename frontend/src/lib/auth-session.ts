import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "./auth";

export async function requireUserSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  return session;
}

export async function getCurrentSession() {
  return getServerSession(authOptions);
}
