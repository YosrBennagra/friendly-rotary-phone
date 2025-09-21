import { cn, formatDateRange } from "@/lib/utils";
import type { CVData, CVTheme } from "@/lib/validations";
// No icons in ATS-only template
import Link from "next/link";
import { InlineEditableText } from "@/components/editor/inline-editable-text";
import { EditableRichText } from "@/components/editor/editable-rich-text";
import { useCVStore } from "@/lib/store";

interface ModernTemplateProps {
  data: CVData;
  theme: CVTheme;
  className?: string;
  editable?: boolean;
}

export function ModernTemplate({ data, theme, className, editable = false }: ModernTemplateProps) {
  const setData = useCVStore((s) => s.setData);
  const has = {
    summary: Boolean(data.header.summaryRichText || data.summary?.content),
    experience: data.experience?.some((s) => !s.hidden) ?? false,
    education: data.education?.some((s) => !s.hidden) ?? false,
    projects: data.projects?.some((s) => !s.hidden) ?? false,
    skills: data.skills?.groups?.some((g) => !g.hidden) ?? false,
    certifications: data.certifications?.some((s) => !s.hidden) ?? false,
    languages: data.languages?.some((s) => !s.hidden) ?? false,
  };

  // ATS is always on; layout forced to single-column; icons/badges removed
  const ats = true;
  return (
    <div
      className={cn(
        "mx-auto max-w-4xl rounded-lg border bg-white p-8 shadow-sm print:shadow-none",
        className,
      )}
      style={{ fontFamily: theme.fontFamily }}
    >
      {/* Header: two-column layout */}
      <header className="pb-6">
        <div className="grid grid-cols-2 items-end">
          <div>
            {editable ? (
              <InlineEditableText
                value={data.header.fullName || ""}
                placeholder="Your Name"
                onChange={(val) => setData({
                  ...data,
                  header: { ...data.header, fullName: val },
                })}
                className="text-4xl font-extrabold tracking-tight uppercase"
              />
            ) : (
              <h1 className="text-4xl font-extrabold tracking-tight uppercase" style={{ color: theme.accentColor }}>
                {data.header.fullName || "Your Name"}
              </h1>
            )}
          </div>
          <div className="text-right">
            {editable ? (
              <InlineEditableText
                value={data.header.title || ""}
                placeholder="Job title"
                onChange={(val) => setData({
                  ...data,
                  header: { ...data.header, title: val },
                })}
                className="text-lg text-foreground/90"
              />
            ) : (
              data.header.title && (
                <p className="text-lg text-foreground/90">{data.header.title}</p>
              )
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className={cn("mt-2 space-y-6")}> 
        {/* CONTACT */}
        {(data.header.phone || data.header.email || data.header.location || data.header.github || data.header.website) && (
          <LabeledRow label="CONTACT">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1 text-sm">
              {data.header.phone && (
                <div>
                  <span className="font-semibold">Phone:</span>{" "}
                  {editable ? (
                    <InlineEditableText
                      value={data.header.phone || ""}
                      placeholder="Phone"
                      onChange={(val) => setData({ ...data, header: { ...data.header, phone: val } })}
                      className="inline"
                    />
                  ) : (
                    <span>{data.header.phone}</span>
                  )}
                </div>
              )}
              {data.header.location && (
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {editable ? (
                    <InlineEditableText
                      value={data.header.location || ""}
                      placeholder="Address"
                      onChange={(val) => setData({ ...data, header: { ...data.header, location: val } })}
                      className="inline"
                    />
                  ) : (
                    <span>{data.header.location}</span>
                  )}
                </div>
              )}
              {data.header.email && (
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  {editable ? (
                    <InlineEditableText
                      value={data.header.email || ""}
                      placeholder="Email"
                      onChange={(val) => setData({ ...data, header: { ...data.header, email: val } })}
                      className="inline"
                    />
                  ) : (
                    <a href={`mailto:${data.header.email}`} className="hover:underline">{data.header.email}</a>
                  )}
                </div>
              )}
              {(data.header.github || data.header.website) && (
                <div>
                  {data.header.github ? (
                    <>
                      <span className="font-semibold">Github:</span>{" "}
                      {editable ? (
                        <InlineEditableText
                          value={data.header.github || ""}
                          placeholder="Github URL"
                          onChange={(val) => setData({ ...data, header: { ...data.header, github: val } })}
                          className="inline"
                        />
                      ) : (
                        <Link href={data.header.github} target="_blank" className="hover:underline">
                          {data.header.github}
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Website:</span>{" "}
                      {editable ? (
                        <InlineEditableText
                          value={data.header.website || ""}
                          placeholder="Website URL"
                          onChange={(val) => setData({ ...data, header: { ...data.header, website: val } })}
                          className="inline"
                        />
                      ) : (
                        <Link href={data.header.website!} target="_blank" className="hover:underline">
                          {data.header.website}
                        </Link>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            {/* Divider */}
            <div className="mt-3 border-t" style={{ borderColor: theme.accentColor + "40" }} />
          </LabeledRow>
        )}

        {/* INTERNSHIPS (Experience) */}
        {has.experience && (
          <LabeledRow label="INTERNSHIPS">
            <div className="space-y-6">
              {(data.experience ?? []).filter((e) => !e.hidden).map((e, idx) => (
                <article key={idx}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-sm font-semibold">
                      {editable ? (
                        <InlineEditableText
                          value={e.role || ""}
                          placeholder="Role"
                          onChange={(val) => {
                            const next = [...(data.experience ?? [])];
                            next[idx] = { ...e, role: val } as any;
                            setData({ ...data, experience: next as any });
                          }}
                          className="inline"
                        />
                      ) : (
                        e.role
                      )}
                      <span className="mx-2">|</span>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {formatDateRange(e.startDate, e.endDate ?? undefined)}
                      </span>
                    </h3>
                  </div>
                  <div className="text-xs text-muted-foreground">{editable ? (
                    <InlineEditableText
                      value={e.company || ""}
                      placeholder="Company"
                      onChange={(val) => {
                        const next = [...(data.experience ?? [])];
                        next[idx] = { ...e, company: val } as any;
                        setData({ ...data, experience: next as any });
                      }}
                      className="inline"
                    />
                  ) : (
                    e.company
                  )}</div>

                  {editable ? (
                    <EditableRichText
                      value={(e.bulletsRichText ?? []).join("\n")}
                      placeholder="Add responsibilities and achievements"
                      onChange={(val) => {
                        const lines = val.split(/\n+/).filter(Boolean);
                        const next = [...(data.experience ?? [])];
                        next[idx] = { ...e, bulletsRichText: lines } as any;
                        setData({ ...data, experience: next as any });
                      }}
                      className="mt-2 text-sm text-muted-foreground"
                    />
                  ) : e.bulletsRichText?.length ? (
                    <ul className="mt-2 ml-5 list-disc text-sm text-muted-foreground">
                      {e.bulletsRichText.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}

                  {e.techStack?.length ? (
                    <p className="mt-2 text-sm text-muted-foreground">Tech stack: {e.techStack.join(", ")}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </LabeledRow>
        )}
      </main>
    </div>
  );
}

function LabeledRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-[110px_1fr] gap-x-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-foreground/80">{label}</div>
      <div>{children}</div>
    </section>
  );
}

// Icons and decorated text removed for ATS