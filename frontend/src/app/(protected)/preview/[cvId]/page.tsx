import { notFound } from "next/navigation";

import { PreviewClient } from "@/components/preview/preview-client";
import { requireUserSession } from "@/lib/auth-session";
import { getCvForPreview } from "@/lib/data/cv";

interface PreviewPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { cvId } = await params;
  const session = await requireUserSession();
  const cv = await getCvForPreview(cvId, session.user.id);

  if (!cv) {
    notFound();
  }

  return (
    <PreviewClient
      cv={{
        id: cv.id,
        title: cv.title,
        template: cv.template,
        theme: cv.theme as any,
        data: cv.data as any,
        updatedAt: cv.updatedAt.toISOString(),
      }}
    />
  );
}

