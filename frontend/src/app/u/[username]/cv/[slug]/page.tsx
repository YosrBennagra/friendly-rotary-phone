import { notFound } from "next/navigation";

import { CVRenderer } from "@/components/cv/cv-renderer";

interface PublicCvPageProps {
  params: Promise<{
    username: string;
    slug: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function PublicCvPage({ params, searchParams }: PublicCvPageProps) {
  const { username, slug } = await params;
  const { token } = await searchParams;

  // For demo purposes, return mock CV data
  const mockCv = {
    data: {
      header: {
        fullName: "John Doe",
        title: "Senior Software Engineer",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "johndoe.dev",
        github: "github.com/johndoe",
        linkedin: "linkedin.com/in/johndoe",
        summary: "Experienced software engineer with 8+ years of full-stack development experience."
      },
      experience: [
        {
          company: "Tech Corp",
          role: "Senior Software Engineer", 
          startDate: "2021-01",
          endDate: null,
          location: "San Francisco, CA",
          bullets: [
            "Led development of microservices architecture serving 10M+ users",
            "Mentored junior developers and established coding best practices"
          ],
          techStack: ["React", "Node.js", "TypeScript", "PostgreSQL"]
        }
      ],
      education: [
        {
          school: "University of California",
          degree: "BS Computer Science", 
          startDate: "2012-09",
          endDate: "2016-05",
          details: "Graduated Magna Cum Laude"
        }
      ],
      skills: {
        groups: [
          {
            name: "Programming Languages",
            items: ["JavaScript", "TypeScript", "Python", "Java"]
          },
          {
            name: "Frameworks", 
            items: ["React", "Next.js", "Node.js", "Express"]
          }
        ]
      },
      projects: []
    },
    theme: {
      font: "Inter",
      colors: {
        primary: "#3b82f6",
        text: "#1f2937", 
        textLight: "#6b7280"
      },
      spacing: "normal"
    },
    template: "MODERN"
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12">
      <div className="mx-auto max-w-4xl rounded-xl border bg-white p-10 shadow">
        <CVRenderer 
          data={mockCv.data as any} 
          theme={mockCv.theme as any} 
          template={mockCv.template as any} 
        />
      </div>
    </div>
  );
}


