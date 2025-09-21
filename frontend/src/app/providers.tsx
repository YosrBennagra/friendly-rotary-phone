"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import dynamic from "next/dynamic";

// Dynamically load ToastContainer on the client only to avoid any SSR bundling issues
const ToastContainer = dynamic(() => import("@/components/ui/toast-container").then((m) => m.ToastContainer), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider delayDuration={150}>
          {children}
          <ToastContainer />
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
