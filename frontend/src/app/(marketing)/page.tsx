import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n";

const featureList = [
  {
    title: "Templates that impress",
    description: "Switch between classic, modern, and compact layouts with one click.",
  },
  {
    title: "Collaborative editor",
    description: "Inline rich text editing, drag and drop ordering, and autosave keep you in flow.",
  },
  {
    title: "Share anywhere",
    description: "Generate secure share links or export production-ready PDFs for applications.",
  },
];

export default async function MarketingPage() {
  const dictionary = await getDictionary("en");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-white">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="container flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              CV
            </span>
            <span>CV Builder</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground">
              How it works
            </Link>
            <Link href="#security" className="hover:text-foreground">
              Security
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm">Start building</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Build your{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                perfect CV
              </span>{" "}
              in minutes
            </h1>
            <p className="mb-10 text-xl text-muted-foreground">
              Professional templates, real-time collaboration, and instant PDF export.
              No more wrestling with Word documents.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/auth/signin">
                <Button size="lg" className="min-w-[200px]">
                  Get started for free
                </Button>
              </Link>
              <Link href="/auth/signin?demo=true">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Try the demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container pb-24" id="features">
          <h2 className="mb-12 text-center text-3xl font-bold">Why choose CV Builder?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {featureList.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-24">
          <div className="container">
            <h2 className="mb-4 text-center text-3xl font-bold">Trusted by professionals worldwide</h2>
            <p className="mb-12 text-center text-muted-foreground">
              Join thousands of job seekers who have landed their dream jobs with CV Builder
            </p>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <p className="mb-4 italic">
                    "Finally, a CV builder that doesn't make me want to throw my laptop out the window.
                    The templates are clean and the editor actually works!"
                  </p>
                  <div className="text-sm">
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-muted-foreground">Product Manager at TechCorp</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <p className="mb-4 italic">
                    "I created three different versions of my CV for different roles in under an hour.
                    The version control feature is genius!"
                  </p>
                  <div className="text-sm">
                    <p className="font-semibold">Marcus Johnson</p>
                    <p className="text-muted-foreground">Software Engineer</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <p className="mb-4 italic">
                    "The PDF export looks exactly like what I see on screen. No more formatting surprises
                    when I send it to recruiters."
                  </p>
                  <div className="text-sm">
                    <p className="font-semibold">Elena Rodriguez</p>
                    <p className="text-muted-foreground">UX Designer</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container py-24" id="how-it-works">
          <h2 className="mb-12 text-center text-3xl font-bold">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>1. Start with a template</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Import an existing JSON export or start with our demo CV preloaded with realistic data.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>2. Customize sections</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Drag, drop, hide, or rename sections. Double-click any text to edit inline with TipTap rich formatting.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>3. Share or export</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Share a live preview with a secure token or export pixel-perfect PDFs for applications.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="pb-24" id="security">
          <Card className="border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle>Security first</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
              <p>Sign-ins use passwordless magic links by default, and CSRF protection is enforced through NextAuth.</p>
              <p>All data is validated with Zod before it ever touches the database. Rate limiting keeps public endpoints safe.</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} CV Builder. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/auth/signin" className="hover:text-foreground">
              Get started
            </Link>
            <Link href="mailto:support@cv-builder.com" className="hover:text-foreground">
              support@cv-builder.com
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}