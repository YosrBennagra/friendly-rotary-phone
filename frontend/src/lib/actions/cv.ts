"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { z } from "zod";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// Schema for CV data validation
const cvDataSchema = z.object({
  title: z.string().min(1),
  template: z.enum(["CLASSIC", "MODERN", "COMPACT"]).default("MODERN"),
  theme: z.object({
    font: z.string().default("Inter"),
    colors: z.object({
      primary: z.string().default("#3b82f6"),
      text: z.string().default("#1f2937"),
      textLight: z.string().default("#6b7280")
    }).default({
      primary: "#3b82f6",
      text: "#1f2937",
      textLight: "#6b7280"
    }),
    spacing: z.enum(["compact", "normal", "spacious"]).default("normal")
  }).default({
    font: "Inter",
    colors: {
      primary: "#3b82f6",
      text: "#1f2937",
      textLight: "#6b7280"
    },
    spacing: "normal"
  }),
  data: z.object({
    header: z.object({
      fullName: z.string().default(""),
      title: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),
      location: z.string().default(""),
      website: z.string().default(""),
      github: z.string().default(""),
      linkedin: z.string().default(""),
      summary: z.string().default("")
    }).default({}),
    experience: z.array(z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string().nullable(),
      location: z.string().default(""),
      bullets: z.array(z.string()).default([]),
      techStack: z.array(z.string()).default([])
    })).default([]),
    education: z.array(z.object({
      school: z.string(),
      degree: z.string(),
      startDate: z.string(),
      endDate: z.string().nullable(),
      details: z.string().default("")
    })).default([]),
    skills: z.object({
      groups: z.array(z.object({
        name: z.string(),
        items: z.array(z.string())
      }))
    }).default({ groups: [] }),
    projects: z.array(z.object({
      name: z.string(),
      link: z.string().default(""),
      description: z.string().default(""),
      bullets: z.array(z.string()).default([]),
      techStack: z.array(z.string()).default([])
    })).default([])
  }).default({})
});

export type CvData = z.infer<typeof cvDataSchema>;

export async function createCvAction(input: { title: string }) {
  try {
    const user = await requireAuth();
    
    // Generate slug from title
    const slug = input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const cvData = {
      id: Math.random().toString(36).substr(2, 9),
      title: input.title,
      slug,
      userId: user.email || "",
      isPublic: false,
      template: "MODERN" as const,
      theme: {
        font: "Inter",
        colors: {
          primary: "#3b82f6",
          text: "#1f2937",
          textLight: "#6b7280"
        },
        spacing: "normal" as const
      },
      data: {
        header: {
          fullName: user.name || "",
          title: "",
          email: user.email || "",
          phone: "",
          location: "",
          website: "",
          github: "",
          linkedin: "",
          summary: ""
        },
        experience: [],
        education: [],
        skills: { groups: [] },
        projects: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    revalidatePath("/dashboard");
    return { success: true, data: cvData };
  } catch (error) {
    console.error("createCvAction", error);
    return { success: false, error: "Unable to create CV" };
  }
}

export async function updateCvAction(id: string, input: Partial<CvData>) {
  try {
    const user = await requireAuth();
    
    // Validate input data
    const validatedData = cvDataSchema.partial().parse(input);
    
    revalidatePath(`/editor/${id}`);
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("updateCvAction", error);
    return { success: false, error: "Unable to update CV" };
  }
}

export async function deleteCvAction(id: string) {
  try {
    const user = await requireAuth();
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("deleteCvAction", error);
    return { success: false, error: "Unable to delete CV" };
  }
}

export async function toggleCvPublicAction(id: string, isPublic: boolean) {
  try {
    const user = await requireAuth();
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("toggleCvPublicAction", error);
    return { success: false, error: "Unable to toggle CV visibility" };
  }
}

// Alias for updateCvAction to match expected export
export const saveCvAction = updateCvAction;

export async function createShareLinkAction(cvId: string) {
  try {
    const user = await requireAuth();
    
    // For demo purposes, return a mock share link
    const token = Math.random().toString(36).substr(2, 16);
    return { 
      success: true, 
      data: {
        token,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/u/demo/cv/${cvId}?token=${token}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    };
  } catch (error) {
    console.error("createShareLinkAction", error);
    return { success: false, error: "Unable to create share link" };
  }
}

export async function createVersionAction(cvId: string, label: string) {
  try {
    const user = await requireAuth();
    
    // For demo purposes, return success
    revalidatePath(`/versions/${cvId}`);
    return { success: true };
  } catch (error) {
    console.error("createVersionAction", error);
    return { success: false, error: "Unable to create version" };
  }
}

export async function restoreVersionAction(cvId: string, versionId: string) {
  try {
    const user = await requireAuth();
    
    // For demo purposes, return success
    revalidatePath(`/editor/${cvId}`);
    revalidatePath(`/versions/${cvId}`);
    return { success: true };
  } catch (error) {
    console.error("restoreVersionAction", error);
    return { success: false, error: "Unable to restore version" };
  }
}

export async function deleteVersionAction(versionId: string) {
  try {
    const user = await requireAuth();
    
    // For demo purposes, return success
    return { success: true };
  } catch (error) {
    console.error("deleteVersionAction", error);
    return { success: false, error: "Unable to delete version" };
  }
}
