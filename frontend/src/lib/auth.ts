import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";

const DEMO_EMAIL = process.env.DEMO_ACCOUNT_EMAIL ?? "demo@cv-builder.com";
const DEMO_PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD ?? "demo";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "Local Demo",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        if (
          credentials.email.toLowerCase() === DEMO_EMAIL.toLowerCase() &&
          credentials.password === DEMO_PASSWORD
        ) {
          const user = await prisma.user.findUnique({
            where: { email: DEMO_EMAIL },
          });

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.cv.create({
        data: {
          userId: user.id,
          title: "My CV",
          slug: `my-cv-${Date.now()}`,
          template: "CLASSIC",
          theme: {
            fontFamily: "Inter",
            accentColor: "#3b82f6",
            spacing: "normal",
            showIcons: true,
            compactMode: false,
          },
          data: {
            header: {
              fullName: user.name ?? "",
              title: "",
              email: user.email ?? "",
              phone: "",
              location: "",
              website: "",
              github: "",
              linkedin: "",
              avatarUrl: user.image ?? "",
              summaryRichText: "",
            },
            experience: [],
            education: [],
            projects: [],
            skills: { groups: [] },
            certifications: [],
            languages: [],
            interests: [],
            customSections: [],
          },
        },
      });
    },
  },
};
