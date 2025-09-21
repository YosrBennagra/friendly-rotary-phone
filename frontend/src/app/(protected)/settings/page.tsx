import { SettingsClient } from "@/components/settings/settings-client";
import { requireUserSession } from "@/lib/auth-session";
import { getUserSettings } from "@/lib/data/cv";

export default async function SettingsPage() {
  const session = await requireUserSession();
  const profile = await getUserSettings(session.user.id);

  return <SettingsClient profile={profile} />;
}
