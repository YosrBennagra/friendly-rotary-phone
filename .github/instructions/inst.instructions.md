You are an expert full-stack engineer. Generate a COMPLETE, PRODUCTION-READY web app named "cv-builder" with the following specs. Create ALL required files with real code (no placeholders), including README.md.

TECH STACK
- Next.js 14+ with App Router, TypeScript, ESLint, Prettier.
- Tailwind CSS + shadcn/ui components (Button, Input, Textarea, Card, DropdownMenu, Dialog, Tabs, Badge, Tooltip).
- State: Zustand or React Query for client state and server cache invalidation; pick what fits best with App Router and server actions.
- Forms & validation: React Hook Form + Zod.
- Drag & drop for sections: dnd-kit.
- Rich text (double-click to edit): TipTap (or Slate) with bold/italic/lists/links; inline editing via double-click turns on contenteditable with save-on-blur and Escape to cancel.
- DB: MongoDB Atlas using Prisma ORM (MongoDB provider). Add Prisma schema and migrations. Seed script for demo data.
- Auth: NextAuth (email/passwordless via magic links using nodemailer + SMTP config), plus Credentials option for local dev. Protect all app pages except landing/login.
- File storage: Store user avatar and custom section icons in /public for demo; prepare an interface to switch to S3 later.
- PDF export: implement both
  1) Server-side PDF route using @react-pdf/renderer (for consistent export), and
  2) Client “Print to PDF” (react-to-print) as fallback.
- Internationalization: English by default; structure ready for i18n (simple config + dictionary pattern).
- Accessibility: Keyboard navigation, focus states, aria labels on interactive controls.
- Security: CSRF via NextAuth, input validation with Zod, server actions with safeParse, rate limit API routes (simple in-memory limiter util).

APP SCOPE & FEATURES
1) Landing Page
   - Hero explaining the product.
   - CTA: “Start building your CV”.
   - Demo login button (auto logs into demo account).
2) Auth Pages
   - Sign in (email link or credentials), sign out.
3) Dashboard (protected)
   - Left sidebar: profile quick info, template/theme picker (at least 3 clean templates), navigation to “Editor”, “Preview”, “Versions”, “Settings”.
   - Top bar: Save status (auto-save), “Share link” (public, read-only), “Export as PDF”.
4) CV Editor (core)
   - Page split: left “Section Library” + “Field controls”, right “Live Canvas”.
   - Sections supported out-of-the-box: Header, Summary, Experience, Education, Skills, Projects, Certifications, Languages, Interests, Custom Section.
   - Double-click any text in the live canvas to edit inline with TipTap; enter to confirm, Esc to cancel; autosave on blur.
   - Add/Remove/Reorder sections via dnd-kit.
   - Add/Remove/Reorder “fields” within a section (e.g., multiple jobs, multiple projects).
   - Per-section visibility toggle, per-field visibility toggle.
   - Theme controls: font family, accent color, spacing density, show icons on/off, compact mode on/off.
   - Layout controls: one-column or two-column templates where sidebar contains Skills/Languages, etc.
   - Live validation (e.g., max bullet characters, date ranges).
   - Import/Export JSON of the CV data.
5) Preview Page
   - Pixel-perfect preview using the current template and theme.
   - “Download PDF (server)” and “Print to PDF (client)” buttons.
6) Versions
   - Simple versioning: on explicit “Save as Version”, snap JSON + template settings into a versions collection; allow restore and compare (diff highlights).
7) Settings
   - Profile (name, email, avatar), Account (delete account), Export data (JSON), Danger zone.
8) Public Share
   - Public read-only route: /u/[username]/cv/[slug], no auth required; indexable toggle off by default, share with token query param.

DATA MODEL (Prisma for MongoDB)
- User: id, name, email (unique), image, createdAt, updatedAt, settings (json).
- Cv: id, userId, title, slug, isPublic, template (enum: “classic”, “modern”, “compact”), theme (json: fonts, colors, spacing, options), data (json; see structure below), createdAt, updatedAt.
- Version: id, cvId, label, snapshot (json: template + theme + data), createdAt.
- ShareToken: id, cvId, token (unique), createdAt, expiresAt (nullable).

CV DATA SHAPE (store in Cv.data as JSON)
{
  header: { fullName, title, email, phone, location, website, github, linkedin, avatarUrl, summaryRichText },
  experience: [ { company, role, startDate, endDate, location, bulletsRichText[], techStack[] } ],
  education: [ { school, degree, startDate, endDate, detailsRichText } ],
  projects: [ { name, link, descriptionRichText, bulletsRichText[], techStack[] } ],
  skills: { groups: [ { name, items: [string] } ] },
  certifications: [ { name, org, date, link } ],
  languages: [ { name, level } ],
  interests: [string],
  customSections: [ { title, items: [ { label, valueRichText } ] } ]
}

DEMO SEED
- Create a demo user and one CV prefilled so the app looks functional on first run.
- Prefill with realistic sample values (name, phone, email, address, GitHub) and a couple of entries in Experience/Education/Projects/Skills to demonstrate formatting.
- Provide a separate seed.ts runnable via `npm run seed`.

AUTH & ROUTING
- Use the Next.js App Router with nested layouts.
- Protect /app/(protected) group with auth middleware.
- Public share routes remain open but read-only.

UI/UX DETAILS
- Inline edit on double click; show subtle pencil icon on hover.
- Autosave: debounce 500ms; optimistic UI with “Saved ✓ / Saving…” indicator.
- Undo (Ctrl+Z) support inside rich text fields.
- Keyboard: Arrow keys move between fields; Enter adds bullet; Shift+Enter line break.
- Toast notifications for saved/restored/exported.

API & SERVER ACTIONS
- Implement server actions for: saveCv(data), createCv(title), duplicateCv(id), deleteCv(id), togglePublic(cvId, enabled), createShareLink(cvId), revokeShareLink(token).
- API routes for NextAuth, PDF export (@react-pdf/renderer), and rate-limited endpoints for public fetch.
- Input validation with Zod for every server action.

DEPLOYMENT & CONFIG
- Create .env.example with: NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL (MongoDB), EMAIL_SERVER, EMAIL_FROM.
- Add Dockerfile (multi-stage) and docker-compose.yml for local MongoDB (optional).
- Vercel notes in README (serverless-friendly: pdf route okay) + alternative Docker deploy.

README.md (must be generated)
- Overview, Features, Tech, Screenshots (placeholders), Getting Started:
  - `npm i`, `cp .env.example .env.local`, set envs, `npx prisma db push`, `npm run seed`, `npm run dev`.
- Production build: `npm run build && npm start` or Vercel deploy steps.
- Data model explained, how to add a new section template.
- How to switch storage to S3 for assets later.
- Security checklist and rate limiting note.
- Troubleshooting section (PDF export, email auth, Mongo connection).

FILE STRUCTURE (suggested)
- /app
  - /(marketing)/page.tsx
  - /(auth)/signin/page.tsx
  - /(protected)/layout.tsx
  - /(protected)/dashboard/page.tsx
  - /(protected)/editor/[cvId]/page.tsx
  - /(protected)/preview/[cvId]/page.tsx
  - /(protected)/versions/[cvId]/page.tsx
  - /u/[username]/cv/[slug]/page.tsx    (public)
  - /api/pdf/[cvId]/route.ts            (@react-pdf/renderer)
- /components (editor, sections, toolbar, pdf)
- /lib (auth, db, prisma, zod, rateLimit)
- /styles (globals.css, templates.css)
- /prisma (schema.prisma, seed.ts)
- /scripts (dev helpers)
- /public (demo images, favicon)

TEMPLATES
- Implement three clean templates:
  1) Classic (one column),
  2) Modern (two column, sidebar for skills),
  3) Compact (space-efficient, tighter line height).
- Abstract section renderers so templates re-use content with different layout.

TESTING
- Add minimal vitest tests for utils (slugify, date ranges, zod parsing).

DELIVERABLES
- All source files, fully wired.
- README.md as described.
- .env.example, Dockerfile, docker-compose.yml (optional for local Mongo).
- Prisma schema + seed.
- NextAuth configured for email link login.
- Working demo after `npm run dev` with seed user and one demo CV.
- Lint passes. TypeScript strict mode.

AFTER GENERATION
- Print final commands the user should run:
  1) npm install
  2) cp .env.example .env.local
  3) set env vars
  4) npx prisma db push
  5) npm run seed
  6) npm run dev

IMPORTANT
- Code should be production-grade, typed, and compile on first run.
- No TODOs; implement the functionality directly.
- Keep components small and readable; comment tricky parts.
