import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { CVData, CVTheme } from "./validations";

export type SectionKey =
  | "header"
  | "summary"
  | "experience"
  | "education"
  | "projects"
  | "skills"
  | "certifications"
  | "languages"
  | "interests"
  | "customSections";

type ArraySections =
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "languages"
  | "interests"
  | "customSections";

type SkillGroupSection = "skills";

interface CVStore {
  cvId: string | null;
  data: CVData;
  theme: CVTheme;
  template: "MODERN";
  sectionOrder: SectionKey[];
  hiddenSections: Set<SectionKey>;
  activeSection: SectionKey | null;
  isEditing: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  setCv: (input: { id: string; data: CVData; theme: CVTheme; template?: "MODERN" }) => void;
  setData: (data: CVData) => void;
  updateSection: (section: SectionKey, value: CVData[SectionKey]) => void;
  updateArrayItem: (section: ArraySections, index: number, value: any) => void;
  addArrayItem: (section: ArraySections, value: any) => void;
  removeArrayItem: (section: ArraySections, index: number) => void;
  updateSkillGroup: (index: number, value: any) => void;
  addSkillGroup: (value: any) => void;
  removeSkillGroup: (index: number) => void;
  reorderSections: (order: SectionKey[]) => void;
  toggleSection: (section: SectionKey) => void;
  setTheme: (theme: Partial<CVTheme>) => void;
  // Template is fixed to 'MODERN'; no setter needed but keep a no-op for compatibility
  setTemplate: (template: "MODERN") => void;
  setActiveSection: (section: SectionKey | null) => void;
  setIsEditing: (state: boolean) => void;
  setSaveStatus: (status: "idle" | "saving" | "saved" | "error") => void;
}

const DEFAULT_ORDER: SectionKey[] = [
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

const defaultData: CVData = {
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

const defaultTheme: CVTheme = {
  fontFamily: "Inter",
  accentColor: "#3b82f6",
  spacing: "normal",
  showIcons: false,
  compactMode: false,
  layout: "single",
  atsMode: true,
  sectionOrder: DEFAULT_ORDER,
  hiddenSections: [],
};

export const useCVStore = create<CVStore>()(
  devtools((set, get) => ({
    cvId: null,
    data: defaultData,
    theme: defaultTheme,
    template: "MODERN",
    sectionOrder: DEFAULT_ORDER,
    hiddenSections: new Set(),
    activeSection: null,
    isEditing: false,
    saveStatus: "idle",
  setCv: ({ id, data, theme, template }) => {
      const sanitizedData: CVData = {
        ...defaultData,
        ...data,
        summary: data.summary ?? { content: "" },
        experience: (data.experience ?? []).map((e: any) => ({
          company: e?.company ?? "",
          role: e?.role ?? "",
          startDate: e?.startDate ?? "",
          endDate: e?.endDate ?? "",
          location: e?.location ?? "",
          bulletsRichText: e?.bulletsRichText ?? [""],
          techStack: e?.techStack ?? [],
          hidden: e?.hidden ?? false,
        })),
        education: (data.education ?? []).map((ed: any) => ({
          school: ed?.school ?? "",
          degree: ed?.degree ?? "",
          startDate: ed?.startDate ?? "",
          endDate: ed?.endDate ?? "",
          detailsRichText: ed?.detailsRichText ?? "",
          hidden: ed?.hidden ?? false,
        })),
        projects: (data.projects ?? []).map((p: any) => ({
          name: p?.name ?? "",
          link: p?.link ?? "",
          descriptionRichText: p?.descriptionRichText ?? "",
          bulletsRichText: p?.bulletsRichText ?? [],
          techStack: p?.techStack ?? [],
          hidden: p?.hidden ?? false,
        })),
        skills: { groups: (data.skills?.groups ?? []).map((g: any) => ({
          name: g?.name ?? "",
          items: g?.items ?? [],
          hidden: g?.hidden ?? false,
        })) },
        certifications: (data.certifications ?? []).map((c: any) => ({
          name: c?.name ?? "",
          org: c?.org ?? "",
          date: c?.date ?? "",
          link: c?.link ?? "",
          hidden: c?.hidden ?? false,
        })),
        languages: (data.languages ?? []).map((l: any) => ({
          name: l?.name ?? "",
          level: l?.level ?? "",
          hidden: l?.hidden ?? false,
        })),
        interests: (data.interests ?? []).map((i: any) => i ?? ""),
        customSections: (data.customSections ?? []).map((cs: any) => ({
          title: cs?.title ?? "",
          items: (cs?.items ?? []).map((it: any) => ({
            label: it?.label ?? "",
            valueRichText: it?.valueRichText ?? "",
            hidden: it?.hidden ?? false,
          })),
          hidden: cs?.hidden ?? false,
        })),
      } as CVData;

      // Normalize theme to ensure required keys (e.g., accentColor) are always present
      const themeNormalized: CVTheme = {
        ...defaultTheme,
        ...(theme as any),
        // Force ATS constraints: no icons and single column for consistency
        showIcons: false,
        layout: "single",
      };

      set({
        cvId: id,
        data: sanitizedData,
        theme: themeNormalized,
  template: "MODERN",
        sectionOrder: (themeNormalized.sectionOrder as SectionKey[] | undefined) ?? DEFAULT_ORDER,
        hiddenSections: new Set((themeNormalized.hiddenSections as SectionKey[] | undefined) ?? []),
      });
    },
    setData: (data) => set({ data }),
    updateSection: (section, value) => {
      set((state) => ({
        data: {
          ...state.data,
          [section]: value,
        },
      }));
    },
    updateArrayItem: (section, index, value) => {
      set((state) => {
        const base = (state.data[section] as any[]) ?? [];
        const array = [...base];
        array[index] = value;
        return {
          data: {
            ...state.data,
            [section]: array,
          },
        };
      });
    },
    addArrayItem: (section, value) => {
      set((state) => {
        const base = (state.data[section] as any[]) ?? [];
        const array = [...base];
        array.push(value);
        return {
          data: {
            ...state.data,
            [section]: array,
          },
        };
      });
    },
    removeArrayItem: (section, index) => {
      set((state) => {
        const base = (state.data[section] as any[]) ?? [];
        const array = [...base];
        array.splice(index, 1);
        return {
          data: {
            ...state.data,
            [section]: array,
          },
        };
      });
    },
    updateSkillGroup: (index, value) => {
      set((state) => {
        const groups = [...state.data.skills.groups];
        groups[index] = value;
        return {
          data: {
            ...state.data,
            skills: { groups },
          },
        };
      });
    },
    addSkillGroup: (value) => {
      set((state) => {
        const groups = [...state.data.skills.groups, value];
        return {
          data: {
            ...state.data,
            skills: { groups },
          },
        };
      });
    },
    removeSkillGroup: (index) => {
      set((state) => {
        const groups = [...state.data.skills.groups];
        groups.splice(index, 1);
        return {
          data: {
            ...state.data,
            skills: { groups },
          },
        };
      });
    },
    reorderSections: (order) => {
      set((state) => ({
        sectionOrder: order,
        theme: {
          ...state.theme,
          sectionOrder: order,
        },
      }));
    },
    toggleSection: (section) => {
      set((state) => {
        const hidden = new Set(state.hiddenSections);
        if (hidden.has(section)) {
          hidden.delete(section);
        } else {
          hidden.add(section);
        }
        return {
          hiddenSections: hidden,
          theme: {
            ...state.theme,
            hiddenSections: Array.from(hidden),
          },
        };
      });
    },
    setTheme: (theme) => {
      set((state) => {
        const hiddenSet = new Set(
          (theme.hiddenSections as SectionKey[] | undefined) ?? Array.from(state.hiddenSections),
        );
        const order = (theme.sectionOrder as SectionKey[] | undefined) ?? state.sectionOrder;
        const nextTheme: CVTheme = {
          ...state.theme,
          ...theme,
          sectionOrder: order,
          hiddenSections: Array.from(hiddenSet),
        };

        return {
          theme: nextTheme,
          sectionOrder: order,
          hiddenSections: hiddenSet,
        };
      });
    },
  setTemplate: (_template) => set({ template: "MODERN" }),
    setActiveSection: (section) => set({ activeSection: section }),
    setIsEditing: (isEditing) => set({ isEditing }),
    setSaveStatus: (saveStatus) => set({ saveStatus }),
  }))
);





