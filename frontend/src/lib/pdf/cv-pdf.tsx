import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

import type { CVData, CVTheme } from "@/lib/validations";
import { formatDateRange } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  title: {
    fontSize: 12,
    marginTop: 4,
  },
  contact: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    color: "#6b7280",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  experienceItem: {
    marginBottom: 6,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bullets: {
    marginTop: 4,
    marginLeft: 10,
  },
  bullet: {
    fontSize: 10,
    marginBottom: 2,
  },
});

interface PDFDocumentProps {
  data: CVData;
  theme: CVTheme;
}

export function CVPDFDocument({ data, theme }: PDFDocumentProps) {
  const visibleExperience = data.experience.filter((item) => !item.hidden);
  const visibleEducation = data.education.filter((item) => !item.hidden);
  const visibleProjects = data.projects.filter((item) => !item.hidden);
  const visibleSkillGroups = data.skills.groups.filter((item) => !item.hidden);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: theme.fontFamily }] }>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.accentColor }]}>{data.header.fullName || "Your Name"}</Text>
          {data.header.title ? <Text style={styles.title}>{data.header.title}</Text> : null}
          <View style={styles.contact}>
            {data.header.email && <Text>{data.header.email}</Text>}
            {data.header.phone && <Text>{data.header.phone}</Text>}
            {data.header.website && (
              <Link src={data.header.website}>
                {data.header.website}
              </Link>
            )}
            {data.header.linkedin && (
              <Link src={data.header.linkedin}>
                {data.header.linkedin}
              </Link>
            )}
          </View>
        </View>

        {data.summary?.content ? (
          <Section title="Summary" accentColor={theme.accentColor}>
            <Text>{stripHtml(data.summary.content)}</Text>
          </Section>
        ) : null}

        {visibleExperience.length > 0 && (
          <Section title="Experience" accentColor={theme.accentColor}>
            {visibleExperience.map((item, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={{ fontWeight: "bold" }}>{item.role}</Text>
                  <Text>{formatDateRange(item.startDate, item.endDate)}</Text>
                </View>
                <Text>{item.company}</Text>
                {item.location ? <Text>{item.location}</Text> : null}
                {item.bulletsRichText.length > 0 && (
                  <View style={styles.bullets}>
                    {item.bulletsRichText.map((bullet, bulletIndex) => (
                      <Text key={bulletIndex} style={styles.bullet}>
                        • {stripHtml(bullet)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </Section>
        )}

        {visibleEducation.length > 0 && (
          <Section title="Education" accentColor={theme.accentColor}>
            {visibleEducation.map((item, index) => (
              <View key={index} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: "bold" }}>{item.degree}</Text>
                <Text>{item.school}</Text>
                <Text>{formatDateRange(item.startDate, item.endDate)}</Text>
              </View>
            ))}
          </Section>
        )}

        {visibleProjects.length > 0 && (
          <Section title="Projects" accentColor={theme.accentColor}>
            {visibleProjects.map((item, index) => (
              <View key={index} style={{ marginBottom: 6 }}>
                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                {item.descriptionRichText && <Text>{stripHtml(item.descriptionRichText)}</Text>}
              </View>
            ))}
          </Section>
        )}

        {visibleSkillGroups.length > 0 && (
          <Section title="Skills" accentColor={theme.accentColor}>
            {visibleSkillGroups.map((group, index) => (
              <Text key={index} style={{ marginBottom: 2 }}>
                {group.name}: {group.items.join(", ")}
              </Text>
            ))}
          </Section>
        )}
      </Page>
    </Document>
  );
}

function Section({ title, accentColor, children }: { title: string; accentColor: string; children: React.ReactNode }) {
  return (
    <View style={styles.section} fixed={false}>
      <Text style={[styles.sectionTitle, { color: accentColor }]}>{title}</Text>
      {children}
    </View>
  );
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
}
