import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 px-4 py-12">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Check your inbox</h1>
          <p className="text-muted-foreground">
            We have sent a secure magic link to your email address. Follow the link to finish signing in.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Return to homepage</Link>
        </Button>
      </div>
    </div>
  );
}
