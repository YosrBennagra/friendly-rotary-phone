"use client";

import * as React from "react";
import { FileDown, FileUp, Loader2, Share2, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { InlineEditableText } from "./inline-editable-text";
import { SectionLibrary } from "./section-library";
import { ThemeControls } from "./theme-controls";
import { EditorCanvas } from "./editor-canvas";
import { useCVStore } from "@/lib/store";
import { saveCvAction, createShareLinkAction } from "@/lib/actions/cv";
import { cvDataSchema, cvThemeSchema, type CVData, type CVTheme } from "@/lib/validations";
import { slugify } from "@/lib/utils";

interface EditorClientProps {
  cv: {
    id: string;
    title: string;
    slug: string;
    template: "CLASSIC" | "MODERN" | "COMPACT";
    theme: CVTheme;
    data: CVData;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const AUTOSAVE_INTERVAL = 600;

export function EditorClient({ cv, user }: EditorClientProps) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const setCv = useCVStore((state) => state.setCv);
  const data = useCVStore((state) => state.data);
  const theme = useCVStore((state) => state.theme);
  const template = useCVStore((state) => state.template);
  const setData = useCVStore((state) => state.setData);
  const setTheme = useCVStore((state) => state.setTheme);
  const setTemplate = useCVStore((state) => state.setTemplate);
  const setSaveStatus = useCVStore((state) => state.setSaveStatus);
  const saveStatus = useCVStore((state) => state.saveStatus);
  const cvId = useCVStore((state) => state.cvId);

  const [title, setTitle] = React.useState(cv.title);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);

  React.useEffect(() => {
    const sanitizedData = {
      ...cv.data,
      summary: cv.data.summary ?? { content: "" },
    };
    const sanitizedTheme = {
      ...cv.theme,
      sectionOrder: cv.theme.sectionOrder ?? undefined,
      hiddenSections: cv.theme.hiddenSections ?? undefined,
    };

    setCv({ id: cv.id, data: sanitizedData, theme: sanitizedTheme, template: cv.template });
    setTitle(cv.title);
    setIsInitialized(true);
    setSaveStatus("idle");
  }, [cv, setCv, setSaveStatus]);

  React.useEffect(() => {
    if (!isInitialized || !cvId) {
      return;
    }
    setSaveStatus("saving");
    const handle = setTimeout(async () => {
      const result = await saveCvAction({
        cvId,
        data,
        theme,
        template,
        title,
      });
      if (!result.success) {
        setSaveStatus("error");
        toast({ title: "Autosave failed", description: result.error });
        return;
      }
      setSaveStatus("saved");
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(handle);
  }, [data, theme, template, title, cvId, isInitialized, setSaveStatus]);

  const handleExport = () => {
    const payload = {
      title,
      template,
      theme,
      data,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(title || "cv")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const dataResult = cvDataSchema.safeParse(parsed.data ?? parsed);
      if (!dataResult.success) {
        throw new Error("Data JSON is invalid");
      }

      const themeResult = cvThemeSchema.safeParse(parsed.theme ?? theme);
      if (!themeResult.success) {
        throw new Error("Theme JSON is invalid");
      }

      setData(dataResult.data);
      setTheme(themeResult.data);
      if (parsed.template) {
        setTemplate(parsed.template);
      }
      if (parsed.title) {
        setTitle(parsed.title);
      }
      toast({ title: "Import successful", description: "CV content replaced with imported data" });
    } catch (error) {
      console.error(error);
      toast({ title: "Import failed", description: "Unable to import JSON file" });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const result = await createShareLinkAction(cv.id);
      if (!result.success) {
        toast({ title: "Share link error", description: result.error });
        return;
      }
      const userSlug = slugify(user.name || user.email || "user");
      const base = encodeURIComponent(userSlug);
      const shareUrl = `${window.location.origin}/u/${base}/cv/${cv.slug}?token=${result.data.token}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Share link copied", description: shareUrl });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
      <Card className="border-none bg-gradient-to-r from-slate-50 to-white shadow">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <InlineEditableText
              value={title}
              placeholder="Untitled CV"
              onChange={setTitle}
              className="text-2xl font-semibold tracking-tight"
            />
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">Autosave {saveStatus === "saving" ? "in progress" : saveStatus === "saved" ? "ready" : saveStatus}</Badge>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Protected draft
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" /> Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <FileUp className="mr-2 h-4 w-4" /> Import JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push(`/preview/${cv.id}`)}>
              <Sparkles className="mr-2 h-4 w-4" /> Live preview
            </Button>
            <Button variant="default" size="sm" onClick={handleShare} disabled={isSharing}>
              {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />} Share link
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <SectionLibrary />
          <ThemeControls />
        </div>
        <div className="space-y-6">
          <EditorCanvas />
        </div>
      </div>
    </div>
  );
}








