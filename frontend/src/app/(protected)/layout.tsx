import { ProtectedShell } from "@/components/dashboard/protected-shell";
import { requireUserSession } from "@/lib/auth-session";
import { getUserSettings } from "@/lib/data/cv";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUserSession();
  const profile = await getUserSettings(session.user.id);

  return <ProtectedShell user={profile}>{children}</ProtectedShell>;
}
