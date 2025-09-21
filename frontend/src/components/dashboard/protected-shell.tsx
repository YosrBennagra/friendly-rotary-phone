"use client";

import * as React from "react";
import { LogOut, Menu, Settings2, SquarePen } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ProtectedShellProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Settings", href: "/settings" },
];

export function ProtectedShell({ user, children }: ProtectedShellProps) {
  const pathname = usePathname();

  const renderSidebar = () => (
    <div className="flex h-full flex-col">
      <div className="px-6 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            CV
          </span>
          <span>CV Builder</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground transition hover:text-foreground",
              pathname?.startsWith(item.href) && "bg-muted text-foreground",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t px-6 py-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Avatar"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <SquarePen className="h-5 w-5" />
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">{user?.name ?? "Welcome"}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const activeTitle = React.useMemo(() => {
    if (!pathname) {
      return "CV Builder";
    }
    if (pathname === "/dashboard") {
      return "Dashboard";
    }
    if (pathname.startsWith("/settings")) {
      return "Settings";
    }
    if (pathname.includes("/versions")) {
      return "Versions";
    }
    if (pathname.includes("/preview")) {
      return "Preview";
    }
    if (pathname.includes("/editor")) {
      return "Editor";
    }
    return "CV Builder";
  }, [pathname]);

  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-background lg:block">{renderSidebar()}</aside>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between gap-3 border-b bg-background px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                {renderSidebar()}
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold capitalize">{activeTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">
                <Settings2 className="mr-2 h-4 w-4" /> Settings
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
