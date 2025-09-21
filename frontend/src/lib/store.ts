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
  template: "CLASSIC" | "MODERN" | "COMPACT";
  sectionOrder: SectionKey[];
  hiddenSections: Set<SectionKey>;
  activeSection: SectionKey | null;
  isEditing: boolean;
  saveStatus: "idle" | "saving" | "saved" | "error";
  setCv: (input: { id: string; data: CVData; theme: CVTheme; template: "CLASSIC" | "MODERN" | "COMPACT" }) => void;
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
  setTemplate: (template: "CLASSIC" | "MODERN" | "COMPACT") => void;
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
  showIcons: true,
  compactMode: false,
  layout: "single",
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
      };

      set({
        cvId: id,
        data: sanitizedData,
        theme,
        template,
        sectionOrder: (theme.sectionOrder as SectionKey[] | undefined) ?? DEFAULT_ORDER,
        hiddenSections: new Set((theme.hiddenSections as SectionKey[] | undefined) ?? []),
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
        const array = [...(state.data[section] as any[])];
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
        const array = [...(state.data[section] as any[])];
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
        const array = [...(state.data[section] as any[])];
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
    setTemplate: (template) => set({ template }),
    setActiveSection: (section) => set({ activeSection: section }),
    setIsEditing: (isEditing) => set({ isEditing }),
    setSaveStatus: (saveStatus) => set({ saveStatus }),
  }))
);





