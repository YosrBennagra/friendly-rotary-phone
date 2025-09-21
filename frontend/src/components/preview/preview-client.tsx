"use client";

import * as React from "react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { ArrowLeft, Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CVRenderer } from "@/components/cv/cv-renderer";
import type { CVData, CVTheme } from "@/lib/validations";
import { formatDistanceToNow } from "date-fns";

interface PreviewClientProps {
  cv: {
    id: string;
    title: string;
    template: "CLASSIC" | "MODERN" | "COMPACT";
    theme: CVTheme;
    data: CVData;
    updatedAt: string;
  };
}

export function PreviewClient({ cv }: PreviewClientProps) {
  const printRef = React.useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({ content: () => printRef.current });

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{cv.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{cv.template.toLowerCase()}</Badge>
              <span>Updated {formatDistanceToNow(new Date(cv.updatedAt))} ago</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print to PDF
            </Button>
            <Button variant="default" size="sm" asChild>
              <a href={`/api/pdf/${cv.id}`} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-white shadow" ref={printRef}>
        <CVRenderer data={cv.data} theme={cv.theme} template={cv.template} className="p-8" />
      </div>
    </div>
  );
}

