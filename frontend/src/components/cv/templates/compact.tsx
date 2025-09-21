import { cn } from "@/lib/utils";
import type { CVData, CVTheme } from "@/lib/validations";

interface CompactTemplateProps {
  data: CVData;
  theme: CVTheme;
  className?: string;
}

export function CompactTemplate({ data, theme, className }: CompactTemplateProps) {
  return (
    <div
      className={cn("mx-auto max-w-2xl rounded-lg border bg-white p-6", className)}
      style={{ fontFamily: theme.fontFamily }}
    >
      <header className="mb-4">
        <h1 className="text-2xl font-bold" style={{ color: theme.accentColor }}>
          {data.header.fullName || "Your Name"}
        </h1>
        {data.header.title && <p className="text-muted-foreground">{data.header.title}</p>}
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {data.header.email && <span>{data.header.email}</span>}
          {data.header.phone && <span>{data.header.phone}</span>}
        </div>
      </header>

      <main className="space-y-4">
        {data.experience.filter((item) => !item.hidden).length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>
              Experience
            </h2>
            <div className="mt-1 space-y-2">
              {data.experience.filter((item) => !item.hidden).map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.role}</span>
                    <span className="text-muted-foreground">{item.company}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.filter((item) => !item.hidden).length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: theme.accentColor }}>
              Education
            </h2>
            <div className="mt-1 space-y-2">
              {data.education.filter((item) => !item.hidden).map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.degree}</span>
                    <span className="text-muted-foreground">{item.school}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}