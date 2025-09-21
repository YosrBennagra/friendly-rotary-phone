import { notFound } from "next/navigation";

import { VersionsClient } from "@/components/versions/versions-client";
import { requireUserSession } from "@/lib/auth-session";
import { getCvForPreview, getCvVersions } from "@/lib/data/cv";

interface VersionsPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function VersionsPage({ params }: VersionsPageProps) {
  const { cvId } = await params;
  const session = await requireUserSession();
  const cv = await getCvForPreview(cvId, session.user.id);

  if (!cv) {
    notFound();
  }

  const versions = await getCvVersions(cv.id, session.user.id);

  return (
    <VersionsClient
      cvId={cv.id}
      current={{
        template: cv.template,
        theme: cv.theme as any,
        data: cv.data as any,
      }}
      versions={versions.map((version) => ({
        id: version.id,
        label: version.label,
        createdAt: version.createdAt.toISOString(),
        snapshot: version.snapshot as any,
      }))}
    />
  );
}
