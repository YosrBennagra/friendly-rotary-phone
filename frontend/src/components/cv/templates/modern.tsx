import { cn } from "@/lib/utils";
import type { CVData, CVTheme } from "@/lib/validations";

interface ModernTemplateProps {
  data: CVData;
  theme: CVTheme;
  className?: string;
}

export function ModernTemplate({ data, theme, className }: ModernTemplateProps) {
  return (
    <div
      className={cn("mx-auto max-w-4xl rounded-lg border bg-gradient-to-br from-white to-gray-50 p-8", className)}
      style={{ fontFamily: theme.fontFamily }}
    >
      <header className="pb-8">
        <h1 className="text-4xl font-bold" style={{ color: theme.accentColor }}>
          {data.header.fullName || "Your Name"}
        </h1>
        {data.header.title && (
          <p className="mt-2 text-xl text-muted-foreground">{data.header.title}</p>
        )}
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
          {data.header.email && <span>📧 {data.header.email}</span>}
          {data.header.phone && <span>📱 {data.header.phone}</span>}
          {data.header.location && <span>📍 {data.header.location}</span>}
        </div>
      </header>

      <main className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {data.experience.filter((item) => !item.hidden).length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: theme.accentColor }}>
                Experience
              </h2>
              <div className="space-y-4">
                {data.experience.filter((item) => !item.hidden).map((item, index) => (
                  <div key={index} className="border-l-2 pl-4" style={{ borderColor: theme.accentColor }}>
                    <h3 className="font-semibold">{item.role}</h3>
                    <p className="text-muted-foreground">{item.company}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {data.education.filter((item) => !item.hidden).length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.accentColor }}>
                Education
              </h2>
              <div className="space-y-3">
                {data.education.filter((item) => !item.hidden).map((item, index) => (
                  <div key={index}>
                    <p className="font-medium">{item.degree}</p>
                    <p className="text-sm text-muted-foreground">{item.school}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
}