"use client";

import * as React from "react";
import { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type SignInForm = z.infer<typeof signInSchema>;

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@cv-builder.com";

function SignInForm() {
  const router = useRouter();
  const { status } = useSession();
  const params = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "" },
  });

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  React.useEffect(() => {
    if (params?.get("demo") === "1") {
      void signIn("credentials", {
        email: DEMO_EMAIL,
        password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "demo",
        callbackUrl: "/dashboard",
      });
    }
  }, [params]);

  const onSubmit = async ({ email }: SignInForm) => {
    const result = await signIn("email", { email, redirect: false });
    if (result?.error) {
      toast({ title: "Sign in failed", description: result.error });
      return;
    }
    router.push("/auth/verify-request");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md border-muted/70">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-2xl font-semibold">Sign in to CV Builder</CardTitle>
          <CardDescription>
            Receive a magic link in your inbox or explore instantly with the demo account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">We will send a one-time login link to this address.</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}Send magic link
            </Button>
          </form>
          <div className="relative text-center text-xs uppercase text-muted-foreground">
            <span className="bg-background px-2">or</span>
            <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 border-t" aria-hidden />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              signIn("credentials", {
                email: DEMO_EMAIL,
                password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "demo",
                callbackUrl: "/dashboard",
              })
            }
          >
            <Sparkles className="mr-2 h-4 w-4" /> Continue with demo account
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Need an invite? <Link href="mailto:support@cv-builder.com" className="underline">Contact support</Link>
          </p>
        </CardContent>
      </Card>
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
