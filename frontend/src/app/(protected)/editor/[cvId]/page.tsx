import { notFound } from "next/navigation";

import { EditorClient } from "@/components/editor/editor-client";
import { requireUserSession } from "@/lib/auth-session";
import { getCvForEditing } from "@/lib/data/cv";

interface EditorPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { cvId } = await params;
  const session = await requireUserSession();
  const cv = await getCvForEditing(cvId, session.user.id);

  if (!cv) {
    notFound();
  }

  return (
    <EditorClient
      cv={{
        id: cv.id,
        title: cv.title,
        slug: cv.slug,
        template: cv.template,
        theme: cv.theme as any,
        data: cv.data as any,
      }}
      user={{
        id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
      }}
    />
  );
}
