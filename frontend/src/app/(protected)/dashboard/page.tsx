import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { requireUserSession } from "@/lib/auth-session";
import { getUserDashboardCvs } from "@/lib/data/cv";

export default async function DashboardPage() {
  const session = await requireUserSession();
  const rawCvs = await getUserDashboardCvs(session.user.id);

  const cvs = rawCvs.map((cv: any) => ({
    ...cv,
    updatedAt: cv.updatedAt.toISOString(),
    shareTokens: cv.shareTokens.map((token: any) => ({
      ...token,
      createdAt: token.createdAt.toISOString(),
    })),
  }));

  return <DashboardClient initialCvs={cvs} userId={session.user.id} />;
}
