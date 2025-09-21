"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const demo = searchParams.get("demo");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setMessage({ type: "error", text: "Failed to send magic link. Please try again." });
      } else {
        setMessage({ 
          type: "success", 
          text: "Check your email for a sign-in link!" 
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsDemo(true);
    setMessage(null);

    try {
      const result = await signIn("credentials", {
        email: "demo@cv-builder.com",
        password: "demo123",
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setMessage({ type: "error", text: "Demo sign-in failed. Please try again." });
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Demo sign-in failed. Please try again." });
    } finally {
      setIsDemo(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
              CV
            </span>
            CV Builder
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to receive a magic link, or try the demo
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to access your CV projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert variant={message.type === "error" ? "destructive" : "default"}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send magic link
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleDemoSignIn}
              disabled={isDemo}
            >
              {isDemo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Try the demo
            </Button>

            {demo && (
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-sm text-blue-700">
                  <strong>Demo Mode:</strong> You can explore the app with pre-loaded sample data.
                  No account required!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <span className="text-muted-foreground">
            Just enter your email above to get started.
          </span>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div>Loading...</div></div>}>
      <SignInForm />
    </Suspense>
  );
}