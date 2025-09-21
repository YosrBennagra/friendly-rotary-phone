import { describe, expect, it } from "vitest";

import { formatDateRange, slugify } from "@/lib/utils";
import { cvDataSchema } from "@/lib/validations";

describe("utils", () => {
  it("slugifies strings", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("  Senior Developer !! ")).toBe("senior-developer");
  });

  it("formats date ranges", () => {
    expect(formatDateRange("2020", "2022")).toBe("2020 - 2022");
    expect(formatDateRange("2020", null)).toBe("2020 - Present");
    expect(formatDateRange(undefined, undefined)).toBe("");
  });

  it("validates CV data shape", () => {
    const data = {
      header: {
        fullName: "Test User",
        title: "Engineer",
        email: "test@example.com",
        phone: "",
        location: "",
        website: "",
        github: "",
        linkedin: "",
        avatarUrl: "",
        summaryRichText: "",
      },
      summary: { content: "<p>Summary</p>" },
      experience: [],
      education: [],
      projects: [],
      skills: { groups: [] },
      certifications: [],
      languages: [],
      interests: [],
      customSections: [],
    };

    const result = cvDataSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
