import type { ComponentType } from "react";
import {
  Briefcase,
  FileText,
  GraduationCap,
  Languages,
  LayoutList,
  Lightbulb,
  NotebookPen,
  Sparkles,
  User,
} from "lucide-react";

import type { SectionKey } from "@/lib/store";

export const SECTION_METADATA: Record<SectionKey, { label: string; description: string; icon: ComponentType<{ className?: string }>; }> = {
  header: { label: "Header", description: "Name, title, contact details", icon: User },
  summary: { label: "Summary", description: "Short professional overview", icon: Sparkles },
  experience: { label: "Experience", description: "Roles, achievements, bullet points", icon: Briefcase },
  education: { label: "Education", description: "Schools and degrees", icon: GraduationCap },
  projects: { label: "Projects", description: "Highlighted work and outcomes", icon: Lightbulb },
  skills: { label: "Skills", description: "Grouped competencies", icon: LayoutList },
  certifications: { label: "Certifications", description: "Professional credentials", icon: FileText },
  languages: { label: "Languages", description: "Languages and proficiency", icon: Languages },
  interests: { label: "Interests", description: "Hobbies and interests", icon: NotebookPen },
  customSections: { label: "Custom sections", description: "Tailored content blocks", icon: NotebookPen },
};
