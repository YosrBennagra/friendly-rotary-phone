import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const identifier = request.headers.get("x-forwarded-for") ?? "export";
  if (isRateLimited(identifier, 10, 60_000)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        cvs: {
          include: {
            versions: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        settings: user.settings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      cvs: user.cvs.map((cv: any) => ({
        id: cv.id,
        title: cv.title,
        slug: cv.slug,
        isPublic: cv.isPublic,
        template: cv.template,
        theme: cv.theme,
        data: cv.data,
        createdAt: cv.createdAt,
        updatedAt: cv.updatedAt,
        versions: cv.versions.map((version: any) => ({
          id: version.id,
          label: version.label,
          snapshot: version.snapshot,
          createdAt: version.createdAt,
        })),
      })),
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=\"cv-builder-export.json\"",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
