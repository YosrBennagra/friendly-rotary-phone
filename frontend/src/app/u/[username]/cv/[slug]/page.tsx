import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { CVRenderer } from "@/components/cv/cv-renderer";
import { prisma } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import { slugify } from "@/lib/utils";

interface PublicCvPageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function PublicCvPage({ params, searchParams }: PublicCvPageProps) {
  const { username, slug } = await params;
  const { token } = await searchParams;
  const identifier = (await headers()).get("x-forwarded-for") ?? "public-cv";
  if (isRateLimited(identifier, 60, 60_000)) {
    notFound();
  }

  if (token) {
    const share = await prisma.shareToken.findUnique({
      where: { token },
      include: {
        cv: {
          include: {
            user: true,
          },
        },
      },
    });

    if (share && share.cv.slug === slug) {
      return renderCv(share.cv);
    }
  }

  const publicCv = await prisma.cv.findFirst({
    where: {
      slug: slug,
      isPublic: true,
    },
    include: {
      user: true,
    },
  });

  if (!publicCv) {
    notFound();
  }

  const userSlug = slugify(publicCv.user?.name ?? publicCv.user?.email ?? "");
  if (userSlug !== username) {
    notFound();
  }

  return renderCv(publicCv);
}

function renderCv(cv: { data: unknown; theme: unknown; template: any }) {
  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <div className="mx-auto max-w-4xl rounded-xl border bg-white p-10 shadow">
        <CVRenderer data={cv.data as any} theme={cv.theme as any} template={cv.template} />
      </div>
    </div>
  );
}
