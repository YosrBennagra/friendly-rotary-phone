"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { createVersionAction, deleteVersionAction, restoreVersionAction } from "@/lib/actions/cv";
import { cn } from "@/lib/utils";
import type { CVData, CVTheme } from "@/lib/validations";

interface VersionSnapshot {
  template: "CLASSIC" | "MODERN" | "COMPACT";
  theme: CVTheme;
  data: CVData;
}

interface VersionsClientProps {
  cvId: string;
  current: VersionSnapshot;
  versions: Array<{
    id: string;
    label: string;
    createdAt: string;
    snapshot: VersionSnapshot;
  }>;
}

export function VersionsClient({ cvId, current, versions }: VersionsClientProps) {
  const router = useRouter();
  const [label, setLabel] = React.useState("Snapshot");
  const [selectedId, setSelectedId] = React.useState<string | null>(versions[0]?.id ?? null);
  const [isPending, startTransition] = React.useTransition();
  const selectedVersion = versions.find((version) => version.id === selectedId) ?? versions[0];

  const sectionDiff = React.useMemo(() => {
    if (!selectedVersion) {
      return [] as Array<{ key: keyof CVData | "template" | "theme"; changed: boolean }>;
    }

    const keys: Array<keyof CVData | "template" | "theme"> = [
      "template",
      "theme",
      "header",
      "summary",
      "experience",
      "education",
      "projects",
      "skills",
      "certifications",
      "languages",
      "interests",
      "customSections",
    ];

    return keys.map((key) => {
      const currentValue = key === "template" ? current.template : key === "theme" ? current.theme : current.data[key];
      const snapshotValue = key === "template" ? selectedVersion.snapshot.template : key === "theme" ? selectedVersion.snapshot.theme : selectedVersion.snapshot.data[key];
      return {
        key,
        changed: JSON.stringify(currentValue) !== JSON.stringify(snapshotValue),
      };
    });
  }, [current, selectedVersion]);

  const handleCreateVersion = () => {
    startTransition(async () => {
      const result = await createVersionAction(cvId, label || "Snapshot");
      if (!result.success) {
        toast({ title: "Unable to create version", description: result.error });
        return;
      }
      toast({ title: "Version saved", description: "Your CV snapshot has been stored." });
      router.refresh();
    });
  };

  const handleRestore = (versionId: string) => {
    startTransition(async () => {
      const result = await restoreVersionAction(cvId, versionId);
      if (!result.success) {
        toast({ title: "Restore failed", description: result.error });
        return;
      }
      toast({ title: "Version restored", description: "Editor reflects the selected version." });
      router.refresh();
    });
  };

  const handleDelete = (versionId: string) => {
    startTransition(async () => {
      const result = await deleteVersionAction(versionId);
      if (!result.success) {
        toast({ title: "Delete failed", description: result.error });
        return;
      }
      toast({ title: "Version removed" });
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Save a new version</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            value={label}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLabel(event.target.value)}
            placeholder="Version label"
            className="md:max-w-sm"
          />
          <Button onClick={handleCreateVersion} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}Save as version
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {versions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No versions yet. Create one to capture your current CV.</p>
            ) : (
              versions.map((version) => (
                <button
                  type="button"
                  key={version.id}
                  onClick={() => setSelectedId(version.id)}
                  className={cn(
                    "w-full rounded-md border px-3 py-2 text-left transition",
                    selectedId === version.id
                      ? "border-slate-400 bg-slate-50"
                      : "border-transparent bg-slate-100/50 hover:bg-slate-100",
                  )}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{version.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(version.createdAt))} ago
                    </span>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedVersion ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{selectedVersion.label}</Badge>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(selectedVersion.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  {sectionDiff.map((item) => (
                    <div key={String(item.key)} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <span className="font-medium text-foreground">{formatKey(String(item.key))}</span>
                      {item.changed ? (
                        <Badge variant="default">Changed</Badge>
                      ) : (
                        <Badge variant="outline">Unchanged</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleRestore(selectedVersion.id)} disabled={isPending}>
                    Restore this version
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(selectedVersion.id)}
                    disabled={isPending}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a version to see differences.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function formatKey(key: string) {
  if (key === "template") return "Template";
  if (key === "theme") return "Theme";
  return key.replace(/([A-Z])/g, " ").replace(/^./, (char: string) => char.toUpperCase());
}
