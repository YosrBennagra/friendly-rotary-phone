import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function GET(request: Request) {
  try {
    // For demo purposes, return a simple export
    const payload = {
      user: {
        id: "demo-user",
        name: "Demo User",
        email: "demo@example.com",
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      cvs: [
        {
          id: "1",
          title: "Software Engineer Resume",
          slug: "software-engineer-resume",
          isPublic: false,
          template: "MODERN",
          data: {
            header: {
              fullName: "John Doe",
              title: "Software Engineer",
              email: "john@example.com"
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ],
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
