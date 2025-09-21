import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./db";

const DEMO_EMAIL = process.env.DEMO_ACCOUNT_EMAIL ?? "demo@cv-builder.com";
const DEMO_PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD ?? "demo";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          // Try to authenticate with the backend
          const response = await api.auth.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.ok) {
            const data = await response.json();
            
            // Store the token for API calls
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', data.access_token);
              if (data.refresh_token) {
                localStorage.setItem('refresh-token', data.refresh_token);
              }
            }

            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              image: data.user.image,
            };
          }

          // Fallback to demo account for development
          if (
            credentials.email.toLowerCase() === DEMO_EMAIL.toLowerCase() &&
            credentials.password === DEMO_PASSWORD
          ) {
            return {
              id: "demo-user",
              email: DEMO_EMAIL,
              name: "Demo User",
              image: null,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          
          // Fallback to demo account if backend is unavailable
          if (
            credentials.email.toLowerCase() === DEMO_EMAIL.toLowerCase() &&
            credentials.password === DEMO_PASSWORD
          ) {
            return {
              id: "demo-user",
              email: DEMO_EMAIL,
              name: "Demo User",
              image: null,
            };
          }
          
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
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
    async signOut() {
      // Clear tokens on sign out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
      }
      
      // Optionally call backend logout endpoint
      try {
        await api.auth.logout();
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },
};
