import { z } from "zod";

export const cvHeaderSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  avatarUrl: z.string().optional(),
  summaryRichText: z.string().optional(),
  hidden: z.boolean().optional(),
});

const hiddenField = { hidden: z.boolean().optional() };

export const experienceItemSchema = z
  .object({
    company: z.string().min(1, "Company is required"),
    role: z.string().min(1, "Role is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().nullable(),
    location: z.string().optional(),
    bulletsRichText: z.array(z.string()).default([]),
    techStack: z.array(z.string()).default([]),
  })
  .extend(hiddenField);

export const educationItemSchema = z
  .object({
    school: z.string().min(1, "School is required"),
    degree: z.string().min(1, "Degree is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    detailsRichText: z.string().optional(),
  })
  .extend(hiddenField);

export const projectItemSchema = z
  .object({
    name: z.string().min(1, "Project name is required"),
    link: z.string().url().optional().or(z.literal("")),
    descriptionRichText: z.string().optional(),
    bulletsRichText: z.array(z.string()).default([]),
    techStack: z.array(z.string()).default([]),
  })
  .extend(hiddenField);

export const skillGroupSchema = z
  .object({
    name: z.string().min(1, "Skill group name is required"),
    items: z.array(z.string()).min(1, "At least one skill is required"),
  })
  .extend(hiddenField);

export const certificationItemSchema = z
  .object({
    name: z.string().min(1, "Certification name is required"),
    org: z.string().min(1, "Organization is required"),
    date: z.string().min(1, "Date is required"),
    link: z.string().url().optional().or(z.literal("")),
  })
  .extend(hiddenField);

export const languageItemSchema = z
  .object({
    name: z.string().min(1, "Language name is required"),
    level: z.string().min(1, "Language level is required"),
  })
  .extend(hiddenField);

export const customSectionItemSchema = z
  .object({
    label: z.string().min(1, "Label is required"),
    valueRichText: z.string().optional(),
  })
  .extend(hiddenField);

export const customSectionSchema = z
  .object({
    title: z.string().min(1, "Section title is required"),
    items: z.array(customSectionItemSchema).default([]),
  })
  .extend(hiddenField);

export const cvDataSchema = z.object({
  header: cvHeaderSchema,
  summary: z.object({ content: z.string().optional() }).optional(),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  skills: z
    .object({
      groups: z.array(skillGroupSchema).default([]),
    })
    .default({ groups: [] }),
  certifications: z.array(certificationItemSchema).default([]),
  languages: z.array(languageItemSchema).default([]),
  interests: z.array(z.string()).default([]),
  customSections: z.array(customSectionSchema).default([]),
});

export const cvThemeSchema = z.object({
  fontFamily: z.string().default("Inter"),
  accentColor: z.string().default("#3b82f6"),
  spacing: z.enum(["compact", "normal", "spacious"]).default("normal"),
  showIcons: z.boolean().default(false),
  compactMode: z.boolean().default(false),
  layout: z.enum(["single", "double"]).default("single"),
  atsMode: z.boolean().default(true),
  sectionOrder: z.array(z.string()).optional(),
  hiddenSections: z.array(z.string()).optional(),
});

export const createCvSchema = z.object({
  title: z.string().min(1, "Title is required"),
  template: z.literal("MODERN").default("MODERN"),
  theme: cvThemeSchema.optional(),
  data: cvDataSchema.optional(),
});

export const updateCvSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  template: z.literal("MODERN").optional(),
  theme: cvThemeSchema.optional(),
  data: cvDataSchema.optional(),
  isPublic: z.boolean().optional(),
});

export type CVHeader = z.infer<typeof cvHeaderSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type LanguageItem = z.infer<typeof languageItemSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type CVData = z.infer<typeof cvDataSchema>;
export type CVTheme = z.infer<typeof cvThemeSchema>;
export type CreateCV = z.infer<typeof createCvSchema>;
export type UpdateCV = z.infer<typeof updateCvSchema>;
