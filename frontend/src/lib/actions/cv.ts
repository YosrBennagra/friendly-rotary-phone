"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "../auth";
import { prisma } from "../db";
import {
  createCvSchema,
  cvDataSchema,
  cvThemeSchema,
  updateCvSchema,
} from "../validations";
import { slugify } from "../utils";

type ActionError = {
  success: false;
  error: string;
  issues?: z.ZodIssue[];
};

type ActionOk<T> = {
  success: true;
  data: T;
};

type ActionResult<T> = ActionOk<T> | ActionError;

const DEFAULT_SECTION_ORDER = [
  "header",
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "languages",
  "interests",
  "customSections",
];

const emptyCvData = {
  header: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    avatarUrl: "",
    summaryRichText: "",
  },
  summary: { content: "" },
  experience: [],
  education: [],
  projects: [],
  skills: { groups: [] },
  certifications: [],
  languages: [],
  interests: [],
  customSections: [],
};

const defaultTheme = {
  fontFamily: "Inter",
  accentColor: "#3b82f6",
  spacing: "normal",
  showIcons: true,
  compactMode: false,
  layout: "single",
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createCvAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireUser();
    const parsed = createCvSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, error: "Validation error", issues: parsed.error.issues };
    }

    const { title, template, theme, data } = parsed.data;
    const baseSlug = slugify(title);

    let slug = baseSlug || "cv-untitled";
    let counter = 1;

    while (
      await prisma.cv.findUnique({
        where: {
          userId_slug: { userId: user.id, slug },
        },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const created = await prisma.cv.create({
      data: {
        userId: user.id,
        title,
        slug,
        template,
        theme: theme ? { ...defaultTheme, ...theme } : defaultTheme,
        data: data ?? { ...emptyCvData, header: { ...emptyCvData.header, email: user.email ?? "" } },
      },
    });

    await prisma.version.create({
      data: {
        cvId: created.id,
        label: "Initial version",
        snapshot: {
          template: created.template,
          theme: created.theme,
          data: created.data,
        },
      },
    });

    revalidatePath("/dashboard");

    return { success: true, data: { id: created.id } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createCvAction error", error);
    return { success: false, error: "Internal server error" };
  }
}

const saveSchema = z.object({
  cvId: z.string(),
  data: cvDataSchema,
  theme: cvThemeSchema.optional(),
  template: z.enum(["CLASSIC", "MODERN", "COMPACT"]).optional(),
  title: z.string().min(1).optional(),
  isPublic: z.boolean().optional(),
});

export async function saveCvAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireUser();
    const parsed = saveSchema.safeParse(input);

    if (!parsed.success) {
      return { success: false, error: "Validation error", issues: parsed.error.issues };
    }

    const { cvId, data, theme, template, title, isPublic } = parsed.data;

    const existing = await prisma.cv.findUnique({ where: { id: cvId } });

    if (!existing || existing.userId !== user.id) {
      return { success: false, error: "CV not found" };
    }

    await prisma.cv.update({
      where: { id: cvId },
      data: {
        data,
        theme: theme ? { ...(existing.theme as any), ...theme } : existing.theme,
        template: template ?? existing.template,
        title: title ?? existing.title,
        isPublic: typeof isPublic === "boolean" ? isPublic : existing.isPublic,
      },
    });

    revalidatePath("/editor");
    revalidatePath("/preview");
    revalidatePath("/versions");

    return { success: true, data: { id: cvId } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("saveCvAction error", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function duplicateCvAction(cvId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireUser();
    const existing = await prisma.cv.findUnique({ where: { id: cvId } });

    if (!existing || existing.userId !== user.id) {
      return { success: false, error: "CV not found" };
    }

    const baseSlug = slugify(`${existing.slug}-copy`);
    let slug = baseSlug;
    let counter = 1;

    while (
      await prisma.cv.findUnique({
        where: { userId_slug: { userId: user.id, slug } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const copy = await prisma.cv.create({
      data: {
        userId: user.id,
        title: `${existing.title} (Copy)`,
        slug,
        template: existing.template,
        theme: existing.theme as any,
        data: existing.data as any,
        isPublic: false,
      },
    });

    await prisma.version.create({
      data: {
        cvId: copy.id,
        label: "Duplicated from existing",
        snapshot: {
          template: copy.template,
          theme: copy.theme,
          data: copy.data,
        },
      },
    });

    revalidatePath("/dashboard");

    return { success: true, data: { id: copy.id } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("duplicateCvAction error", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function deleteCvAction(cvId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireUser();
    const existing = await prisma.cv.findUnique({ where: { id: cvId } });

    if (!existing || existing.userId !== user.id) {
      return { success: false, error: "CV not found" };
    }

    await prisma.shareToken.deleteMany({ where: { cvId } });
    await prisma.version.deleteMany({ where: { cvId } });
    await prisma.cv.delete({ where: { id: cvId } });

    revalidatePath("/dashboard");

    return { success: true, data: { id: cvId } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteCvAction error", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function togglePublicAction(
  cvId: string,
  enabled: boolean,
): Promise<ActionResult<{ id: string; isPublic: boolean }>> {
  try {
    const user = await requireUser();
    const existing = await prisma.cv.findUnique({ where: { id: cvId } });

    if (!existing || existing.userId !== user.id) {
      return { success: false, error: "CV not found" };
    }

    const updated = await prisma.cv.update({
      where: { id: cvId },
      data: { isPublic: enabled },
    });

    revalidatePath("/dashboard");

    return { success: true, data: { id: cvId, isPublic: updated.isPublic } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("togglePublicAction error", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function createShareLinkAction(cvId: string): Promise<ActionResult<{ token: string }>> {
  try {
    const user = await requireUser();
    const existing = await prisma.cv.findUnique({ where: { id: cvId } });

    if (!existing || existing.userId !== user.id) {
      return { success: false, error: "CV not found" };
    }

    const token = randomBytes(16).toString("hex");

    await prisma.shareToken.create({
      data: {
        cvId,
        token,
        expiresAt: null,
      },
    });

    return { success: true, data: { token } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createShareLinkAction error", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function revokeShareLinkAction(token: string): Promise<ActionResult<{ token: string }>> {
  try {
    const user = await requireUser();
    const share = await prisma.shareToken.findUnique({ where: { token } });

    if (!share) {
      return { success: false, error: "Share token not found" };
    }

    const cv = await prisma.cv.findUnique({ where: { id: share.cvId } });

    if (!cv || cv.userId !== user.id) {
      return { success: false, error: "Forbidden" };
    }

    await prisma.shareToken.delete({ where: { token } });

    return { success: true, data: { token } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("revokeShareLinkAction error", error);
    return { success: false, error: "Internal server error" };
  }
}
export async function createVersionAction(cvId: string, label: string): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireUser();
    const cv = await prisma.cv.findUnique({ where: { id: cvId } });

    if (!cv || cv.userId !== user.id) {
      return { success: false, error: "CV not found" };
    }

    const version = await prisma.version.create({
      data: {
        cvId,
        label,
        snapshot: {
          template: cv.template,
          theme: cv.theme,
          data: cv.data,
        },
      },
    });

    revalidatePath(`/versions/${cvId}`);
    return { success: true, data: { id: version.id } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("createVersionAction error", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function restoreVersionAction(versionId: string): Promise<ActionResult<{ cvId: string }>> {
  try {
    const user = await requireUser();
    const version = await prisma.version.findUnique({ where: { id: versionId } });

    if (!version) {
      return { success: false, error: "Version not found" };
    }

    const cv = await prisma.cv.findUnique({ where: { id: version.cvId } });

    if (!cv || cv.userId !== user.id) {
      return { success: false, error: "Forbidden" };
    }

    const snapshot = version.snapshot as { template: string; theme: unknown; data: unknown };

    await prisma.cv.update({
      where: { id: cv.id },
      data: {
        template: snapshot.template as any,
        theme: snapshot.theme as any,
        data: snapshot.data as any,
      },
    });

    revalidatePath(`/editor/${cv.id}`);
    revalidatePath(`/preview/${cv.id}`);
    revalidatePath(`/versions/${cv.id}`);

    return { success: true, data: { cvId: cv.id } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("restoreVersionAction error", error);
    return { success: false, error: "Internal server error" };
  }
}

export async function deleteVersionAction(versionId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireUser();
    const version = await prisma.version.findUnique({ where: { id: versionId } });

    if (!version) {
      return { success: false, error: "Version not found" };
    }

    const cv = await prisma.cv.findUnique({ where: { id: version.cvId } });

    if (!cv || cv.userId !== user.id) {
      return { success: false, error: "Forbidden" };
    }

    await prisma.version.delete({ where: { id: versionId } });
    revalidatePath(`/versions/${cv.id}`);

    return { success: true, data: { id: versionId } };
  } catch (error) {
    if ((error as Error).message === "Unauthorized") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("deleteVersionAction error", error);
    return { success: false, error: "Internal server error" };
  }
}
