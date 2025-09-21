import { cn } from "@/lib/utils";
import type { CVData, CVTheme } from "@/lib/validations";

interface ClassicTemplateProps {
  data: CVData;
  theme: CVTheme;
  className?: string;
}

export function ClassicTemplate({ data, theme, className }: ClassicTemplateProps) {
  return (
    <div
      className={cn("mx-auto max-w-3xl rounded-lg border bg-white p-10", className)}
      style={{ fontFamily: theme.fontFamily }}
    >
      <header className="border-b pb-6">
        <h1 className="text-3xl font-bold" style={{ color: theme.accentColor }}>
          {data.header.fullName || "Your Name"}
        </h1>
        {data.header.title && <p className="text-lg text-muted-foreground">{data.header.title}</p>}
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {data.header.email && <span>{data.header.email}</span>}
          {data.header.phone && <span>{data.header.phone}</span>}
          {data.header.location && <span>{data.header.location}</span>}
        </div>
      </header>

      <main className="mt-6 space-y-6">
        {data.experience.filter((item) => !item.hidden).length > 0 && (
          <section>
            <h2 className="text-lg font-semibold tracking-tight" style={{ color: theme.accentColor }}>
              Experience
            </h2>
            <div className="mt-2 space-y-4">
              {data.experience.filter((item) => !item.hidden).map((item, index) => (
                <article key={index}>
                  <h3 className="font-semibold text-foreground">{item.role}</h3>
                  <p className="text-sm text-muted-foreground">{item.company}</p>
                  {item.bulletsRichText.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {item.bulletsRichText.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} dangerouslySetInnerHTML={{ __html: bullet }} />
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {data.education.filter((item) => !item.hidden).length > 0 && (
          <section>
            <h2 className="text-lg font-semibold tracking-tight" style={{ color: theme.accentColor }}>
              Education
            </h2>
            <div className="mt-2 space-y-3">
              {data.education.filter((item) => !item.hidden).map((item, index) => (
                <div key={index}>
                  <p className="font-semibold text-foreground">{item.degree}</p>
                  <p className="text-muted-foreground">{item.school}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}