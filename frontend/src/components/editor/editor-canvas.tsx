"use client";

import * as React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, EyeOff, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditableRichText } from "./editable-rich-text";
import { InlineEditableText } from "./inline-editable-text";
import { SECTION_METADATA } from "./section-config";
import { useCVStore, type SectionKey } from "@/lib/store";

function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function EditorCanvas() {
  const data = useCVStore((state) => state.data);
  const updateSection = useCVStore((state) => state.updateSection);
  const updateArrayItem = useCVStore((state) => state.updateArrayItem);
  const addArrayItem = useCVStore((state) => state.addArrayItem);
  const removeArrayItem = useCVStore((state) => state.removeArrayItem);
  const updateSkillGroup = useCVStore((state) => state.updateSkillGroup);
  const addSkillGroup = useCVStore((state) => state.addSkillGroup);
  const removeSkillGroup = useCVStore((state) => state.removeSkillGroup);
  const sectionOrder = useCVStore((state) => state.sectionOrder);
  const hiddenSections = useCVStore((state) => state.hiddenSections);
  const theme = useCVStore((state) => state.theme);
  const setTheme = useCVStore((state) => state.setTheme);

  const toggleItemVisibility = (section: SectionKey, index: number) => {
    const array = (data[section] as Array<{ hidden?: boolean }>) ?? [];
    const item = array[index];
    updateArrayItem(section as any, index, { ...item, hidden: !item.hidden });
  };

  const renderHeader = () => (
    <Card key="header" className="border-none shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-bold" style={{ color: theme.accentColor }}>
          <InlineEditableText
            value={data.header.fullName}
            placeholder="Your name"
            onChange={(value) => updateSection("header", { ...data.header, fullName: value })}
            className="cursor-text"
          />
        </CardTitle>
        <InlineEditableText
          value={data.header.title ?? ""}
          placeholder="Professional headline"
          onChange={(value) => updateSection("header", { ...data.header, title: value })}
          className="text-lg text-muted-foreground"
        />
        <EditableRichText
          value={data.header.summaryRichText ?? ""}
          placeholder="Write a concise summary that highlights your strengths"
          onChange={(value) => updateSection("header", { ...data.header, summaryRichText: value })}
          className="mt-4"
        />
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
        <InlineEditableText
          value={data.header.email ?? ""}
          placeholder="Email"
          onChange={(value) => updateSection("header", { ...data.header, email: value })}
        />
        <InlineEditableText
          value={data.header.phone ?? ""}
          placeholder="Phone"
          onChange={(value) => updateSection("header", { ...data.header, phone: value })}
        />
        <InlineEditableText
          value={data.header.location ?? ""}
          placeholder="Location"
          onChange={(value) => updateSection("header", { ...data.header, location: value })}
        />
        <InlineEditableText
          value={data.header.website ?? ""}
          placeholder="Website"
          onChange={(value) => updateSection("header", { ...data.header, website: value })}
        />
        <InlineEditableText
          value={data.header.github ?? ""}
          placeholder="GitHub"
          onChange={(value) => updateSection("header", { ...data.header, github: value })}
        />
        <InlineEditableText
          value={data.header.linkedin ?? ""}
          placeholder="LinkedIn"
          onChange={(value) => updateSection("header", { ...data.header, linkedin: value })}
        />
      </CardContent>
    </Card>
  );

  const renderSummary = () => (
    <Card key="summary" className="border-none shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold" style={{ color: theme.accentColor }}>
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditableRichText
          value={data.summary?.content ?? ""}
          placeholder="Share a high-level overview of your experience"
          onChange={(value) => updateSection("summary", { content: value })}
        />
      </CardContent>
    </Card>
  );

  const renderExperience = () => (
    <Card key="experience" className="border-none shadow-none">
      <SectionHeading title="Experience" />
      <CardContent className="space-y-6">
        {data.experience.map((item, index) => (
          <div key={index} className="rounded-md border border-dashed p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <InlineEditableText
                value={item.role}
                placeholder="Role"
                onChange={(value) => updateArrayItem("experience", index, { ...item, role: value })}
                className="text-base font-semibold text-foreground"
              />
              <span>at</span>
              <InlineEditableText
                value={item.company}
                placeholder="Company"
                onChange={(value) => updateArrayItem("experience", index, { ...item, company: value })}
                className="font-medium text-foreground"
              />
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
              <InlineEditableText
                value={item.location ?? ""}
                placeholder="Location"
                onChange={(value) => updateArrayItem("experience", index, { ...item, location: value })}
              />
              <InlineEditableText
                value={item.startDate ?? ""}
                placeholder="Start"
                onChange={(value) => updateArrayItem("experience", index, { ...item, startDate: value })}
              />
              <InlineEditableText
                value={item.endDate ?? ""}
                placeholder="End or Present"
                onChange={(value) => updateArrayItem("experience", index, { ...item, endDate: value })}
              />
            </div>
            <div className="mt-3 space-y-2">
              {item.bulletsRichText.map((bullet, bulletIndex) => (
                <EditableRichText
                  key={bulletIndex}
                  value={bullet}
                  placeholder="Highlight an accomplishment"
                  onChange={(value) => {
                    const bullets = [...item.bulletsRichText];
                    bullets[bulletIndex] = value;
                    updateArrayItem("experience", index, { ...item, bulletsRichText: bullets });
                  }}
                  className="border border-dashed border-transparent hover:border-muted"
                />
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const bullets = [...item.bulletsRichText, ""];
                  updateArrayItem("experience", index, { ...item, bulletsRichText: bullets });
                }}
              >
                <Plus className="mr-2 h-3 w-3" /> Add bullet
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <InlineEditableText
                value={item.techStack.join(", ")}
                placeholder="Tech stack (comma separated)"
                onChange={(value) => updateArrayItem("experience", index, { ...item, techStack: value.split(",").map((entry) => entry.trim()).filter(Boolean) })}
              />
            </div>
            <SectionControls
              index={index}
              total={data.experience.length}
              hidden={Boolean(item.hidden)}
              onMoveUp={() => {
                if (index === 0) return;
                const next = moveItem(data.experience, index, index - 1);
                updateSection("experience", next as any);
              }}
              onMoveDown={() => {
                if (index === data.experience.length - 1) return;
                const next = moveItem(data.experience, index, index + 1);
                updateSection("experience", next as any);
              }}
              onRemove={() => removeArrayItem("experience", index)}
              onToggle={() => toggleItemVisibility("experience", index)}
            />
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() =>
            addArrayItem("experience", {
              company: "",
              role: "",
              startDate: "",
              endDate: "",
              location: "",
              bulletsRichText: [""],
              techStack: [],
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add experience
        </Button>
      </CardContent>
    </Card>
  );

  const renderEducation = () => (
    <RepeatingSection
      key="education"
      title="Education"
      items={data.education}
      addLabel="education entry"
      onAdd={() =>
        addArrayItem("education", {
          school: "",
          degree: "",
          startDate: "",
          endDate: "",
          detailsRichText: "",
        })
      }
      renderItem={(item, index) => (
        <div className="space-y-2" key={index}>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <InlineEditableText
              value={item.degree}
              placeholder="Degree"
              onChange={(value) => updateArrayItem("education", index, { ...item, degree: value })}
              className="font-semibold"
            />
            <span className="text-muted-foreground">at</span>
            <InlineEditableText
              value={item.school}
              placeholder="School"
              onChange={(value) => updateArrayItem("education", index, { ...item, school: value })}
            />
          </div>
          <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            <InlineEditableText
              value={item.startDate}
              placeholder="Start"
              onChange={(value) => updateArrayItem("education", index, { ...item, startDate: value })}
            />
            <InlineEditableText
              value={item.endDate}
              placeholder="End"
              onChange={(value) => updateArrayItem("education", index, { ...item, endDate: value })}
            />
          </div>
          <EditableRichText
            value={item.detailsRichText ?? ""}
            placeholder="Honors, thesis, relevant coursework"
            onChange={(value) => updateArrayItem("education", index, { ...item, detailsRichText: value })}
          />
          <SectionControls
            index={index}
            total={data.education.length}
            hidden={Boolean(item.hidden)}
            onMoveUp={() => {
              if (index === 0) return;
              updateSection("education", moveItem(data.education, index, index - 1) as any);
            }}
            onMoveDown={() => {
              if (index === data.education.length - 1) return;
              updateSection("education", moveItem(data.education, index, index + 1) as any);
            }}
            onRemove={() => removeArrayItem("education", index)}
            onToggle={() => toggleItemVisibility("education", index)}
          />
        </div>
      )}
    />
  );

  const renderProjects = () => (
    <RepeatingSection
      key="projects"
      title="Projects"
      items={data.projects}
      addLabel="project"
      onAdd={() =>
        addArrayItem("projects", {
          name: "",
          link: "",
          descriptionRichText: "",
          bulletsRichText: [],
          techStack: [],
        })
      }
      renderItem={(item, index) => (
        <div className="space-y-2" key={index}>
          <div className="flex flex-wrap gap-2 text-sm">
            <InlineEditableText
              value={item.name}
              placeholder="Project name"
              onChange={(value) => updateArrayItem("projects", index, { ...item, name: value })}
              className="font-semibold"
            />
            <InlineEditableText
              value={item.link ?? ""}
              placeholder="Link"
              onChange={(value) => updateArrayItem("projects", index, { ...item, link: value })}
              className="text-muted-foreground"
            />
          </div>
          <EditableRichText
            value={item.descriptionRichText ?? ""}
            placeholder="Project summary"
            onChange={(value) => updateArrayItem("projects", index, { ...item, descriptionRichText: value })}
          />
          <div className="space-y-2">
            {item.bulletsRichText.map((bullet, bulletIndex) => (
              <EditableRichText
                key={bulletIndex}
                value={bullet}
                placeholder="Impact statement"
                onChange={(value) => {
                  const bullets = [...item.bulletsRichText];
                  bullets[bulletIndex] = value;
                  updateArrayItem("projects", index, { ...item, bulletsRichText: bullets });
                }}
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const bullets = [...item.bulletsRichText, ""];
                updateArrayItem("projects", index, { ...item, bulletsRichText: bullets });
              }}
            >
              <Plus className="mr-2 h-3 w-3" /> Add bullet
            </Button>
          </div>
          <InlineEditableText
            value={item.techStack.join(", ")}
            placeholder="Technologies"
            onChange={(value) => updateArrayItem("projects", index, { ...item, techStack: value.split(",").map((entry) => entry.trim()).filter(Boolean) })}
            className="text-xs text-muted-foreground"
          />
          <SectionControls
            index={index}
            total={data.projects.length}
            hidden={Boolean(item.hidden)}
            onMoveUp={() => index > 0 && updateSection("projects", moveItem(data.projects, index, index - 1) as any)}
            onMoveDown={() => index < data.projects.length - 1 && updateSection("projects", moveItem(data.projects, index, index + 1) as any)}
            onRemove={() => removeArrayItem("projects", index)}
            onToggle={() => toggleItemVisibility("projects", index)}
          />
        </div>
      )}
    />
  );

  const renderSkills = () => (
    <Card key="skills" className="border-none shadow-none">
      <SectionHeading title="Skills" />
      <CardContent className="space-y-4">
        {data.skills.groups.map((group, index) => (
          <div key={index} className="rounded-md border border-dashed p-4">
            <InlineEditableText
              value={group.name}
              placeholder="Group name"
              onChange={(value) => updateSkillGroup(index, { ...group, name: value })}
              className="font-semibold"
            />
            <InlineEditableText
              value={group.items.join(", ")}
              placeholder="List skills separated by commas"
              onChange={(value) =>
                useCVStore
                  .getState()
                  .updateSkillGroup(index, { ...group, items: value.split(",").map((entry) => entry.trim()).filter(Boolean) })
              }
              className="text-sm text-muted-foreground"
            />
            <SectionControls
              index={index}
              total={data.skills.groups.length}
              hidden={Boolean(group.hidden)}
              onMoveUp={() => {
                if (index === 0) return;
                const next = moveItem(data.skills.groups, index, index - 1);
                updateSection("skills", { groups: next });
              }}
              onMoveDown={() => {
                if (index === data.skills.groups.length - 1) return;
                const next = moveItem(data.skills.groups, index, index + 1);
                updateSection("skills", { groups: next });
              }}
              onRemove={() => removeSkillGroup(index)}
              onToggle={() => updateSkillGroup(index, { ...group, hidden: !group.hidden })}
            />
          </div>
        ))}
        <Button variant="outline" onClick={() => addSkillGroup({ name: "", items: [] })}>
          <Plus className="mr-2 h-4 w-4" /> Add skill group
        </Button>
      </CardContent>
    </Card>
  );

  const renderCertifications = () => (
    <RepeatingSection
      key="certifications"
      title="Certifications"
      items={data.certifications}
      addLabel="certification"
      onAdd={() =>
        addArrayItem("certifications", {
          name: "",
          org: "",
          date: "",
          link: "",
        })
      }
      renderItem={(item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex flex-wrap gap-2 text-sm">
            <InlineEditableText
              value={item.name}
              placeholder="Certification"
              onChange={(value) => updateArrayItem("certifications", index, { ...item, name: value })}
              className="font-semibold"
            />
            <InlineEditableText
              value={item.org}
              placeholder="Issuer"
              onChange={(value) => updateArrayItem("certifications", index, { ...item, org: value })}
            />
          </div>
          <InlineEditableText
            value={item.date}
            placeholder="Date"
            onChange={(value) => updateArrayItem("certifications", index, { ...item, date: value })}
            className="text-sm text-muted-foreground"
          />
          <InlineEditableText
            value={item.link ?? ""}
            placeholder="Link"
            onChange={(value) => updateArrayItem("certifications", index, { ...item, link: value })}
            className="text-xs text-muted-foreground"
          />
          <SectionControls
            index={index}
            total={data.certifications.length}
            hidden={Boolean(item.hidden)}
            onMoveUp={() => index > 0 && updateSection("certifications", moveItem(data.certifications, index, index - 1) as any)}
            onMoveDown={() => index < data.certifications.length - 1 && updateSection("certifications", moveItem(data.certifications, index, index + 1) as any)}
            onRemove={() => removeArrayItem("certifications", index)}
            onToggle={() => toggleItemVisibility("certifications", index)}
          />
        </div>
      )}
    />
  );

  const renderLanguages = () => (
    <RepeatingSection
      key="languages"
      title="Languages"
      items={data.languages}
      addLabel="language"
      onAdd={() =>
        addArrayItem("languages", {
          name: "",
          level: "",
        })
      }
      renderItem={(item, index) => (
        <div key={index} className="flex flex-wrap gap-2 text-sm">
          <InlineEditableText
            value={item.name}
            placeholder="Language"
            onChange={(value) => updateArrayItem("languages", index, { ...item, name: value })}
          />
          <InlineEditableText
            value={item.level}
            placeholder="Level"
            onChange={(value) => updateArrayItem("languages", index, { ...item, level: value })}
          />
          <SectionControls
            index={index}
            total={data.languages.length}
            hidden={Boolean(item.hidden)}
            onMoveUp={() => index > 0 && updateSection("languages", moveItem(data.languages, index, index - 1) as any)}
            onMoveDown={() => index < data.languages.length - 1 && updateSection("languages", moveItem(data.languages, index, index + 1) as any)}
            onRemove={() => removeArrayItem("languages", index)}
            onToggle={() => toggleItemVisibility("languages", index)}
            compact
          />
        </div>
      )}
    />
  );

  const renderInterests = () => (
    <RepeatingSection
      key="interests"
      title="Interests"
      items={data.interests.map((interest) => ({ value: interest }))}
      onAdd={() => addArrayItem("interests", "")}
      renderItem={(item, index) => (
        <div key={index} className="flex items-center justify-between gap-2 text-sm">
          <InlineEditableText
            value={item.value}
            placeholder="Interest"
            onChange={(value) => {
              const interests = [...data.interests];
              interests[index] = value;
              updateSection("interests", interests as any);
            }}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => removeArrayItem("interests", index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    />
  );

  const renderCustomSections = () => (
    <RepeatingSection
      key="customSections"
      title="Custom sections"
      items={data.customSections}
      addLabel="custom section"
      onAdd={() =>
        addArrayItem("customSections", {
          title: "",
          items: [],
        })
      }
      renderItem={(section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-3">
          <InlineEditableText
            value={section.title}
            placeholder="Section title"
            onChange={(value) => updateArrayItem("customSections", sectionIndex, { ...section, title: value })}
            className="font-semibold"
          />
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex} className="rounded-md border border-dashed p-3">
              <InlineEditableText
                value={item.label}
                placeholder="Label"
                onChange={(value) => {
                  const items = [...section.items];
                  items[itemIndex] = { ...item, label: value };
                  updateArrayItem("customSections", sectionIndex, { ...section, items });
                }}
                className="font-medium"
              />
              <EditableRichText
                value={item.valueRichText ?? ""}
                placeholder="Description"
                onChange={(value) => {
                  const items = [...section.items];
                  items[itemIndex] = { ...item, valueRichText: value };
                  updateArrayItem("customSections", sectionIndex, { ...section, items });
                }}
              />
              <SectionControls
                index={itemIndex}
                total={section.items.length}
                hidden={Boolean(item.hidden)}
                onMoveUp={() => {
                  if (itemIndex === 0) return;
                  const items = moveItem(section.items, itemIndex, itemIndex - 1);
                  updateArrayItem("customSections", sectionIndex, { ...section, items });
                }}
                onMoveDown={() => {
                  if (itemIndex === section.items.length - 1) return;
                  const items = moveItem(section.items, itemIndex, itemIndex + 1);
                  updateArrayItem("customSections", sectionIndex, { ...section, items });
                }}
                onRemove={() => {
                  const items = [...section.items];
                  items.splice(itemIndex, 1);
                  updateArrayItem("customSections", sectionIndex, { ...section, items });
                }}
                onToggle={() => {
                  const items = [...section.items];
                  items[itemIndex] = { ...item, hidden: !item.hidden };
                  updateArrayItem("customSections", sectionIndex, { ...section, items });
                }}
                compact
              />
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const items = [...section.items, { label: "", valueRichText: "" }];
              updateArrayItem("customSections", sectionIndex, { ...section, items });
            }}
          >
            <Plus className="mr-2 h-3 w-3" /> Add item
          </Button>
        </div>
      )}
    />
  );

  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    header: renderHeader,
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    skills: renderSkills,
    certifications: renderCertifications,
    languages: renderLanguages,
    interests: renderInterests,
    customSections: renderCustomSections,
  };

  return (
    <div
      className="space-y-10 rounded-lg border bg-white p-8 shadow-sm"
      style={{
        fontFamily: theme.fontFamily,
        gap: theme.spacing === "compact" ? "1rem" : theme.spacing === "spacious" ? "2rem" : "1.5rem",
      }}
    >
      {sectionOrder.map((section) => {
        if (hiddenSections.has(section)) {
          return null;
        }
        return <React.Fragment key={section}>{sectionRenderers[section]?.()}</React.Fragment>;
      })}
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  const theme = useCVStore((state) => state.theme);
  return (
    <CardHeader className="pb-3">
      <CardTitle className="text-xl font-semibold" style={{ color: theme.accentColor }}>
        {title}
      </CardTitle>
    </CardHeader>
  );
}

interface RepeatingSectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onAdd: () => void;
  addLabel?: string;
}

function RepeatingSection<T>({ title, items, renderItem, onAdd, addLabel }: RepeatingSectionProps<T>) {
  const label = addLabel ?? (title.endsWith("s") ? title.slice(0, -1) : title).toLowerCase();

  return (
    <Card className="border-none shadow-none">
      <SectionHeading title={title} />
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-md border border-dashed p-4">
            {renderItem(item, index)}
          </div>
        ))}
        <Button variant="outline" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add {label}
        </Button>
      </CardContent>
    </Card>
  );
}
interface SectionControlsProps {
  index: number;
  total: number;
  hidden: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onToggle: () => void;
  compact?: boolean;
}

function SectionControls({ index, total, hidden, onMoveUp, onMoveDown, onRemove, onToggle, compact }: SectionControlsProps) {
  return (
    <div className={`mt-3 flex flex-wrap items-center ${compact ? "gap-1" : "gap-2"} text-xs text-muted-foreground`}>
      <Button variant="ghost" size="icon" disabled={index === 0} onClick={onMoveUp} aria-label="Move up">
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" disabled={index === total - 1} onClick={onMoveDown} aria-label="Move down">
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle visibility">
        {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}













