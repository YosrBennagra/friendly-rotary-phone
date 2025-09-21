"use client";

import * as React from "react";
import { Copy, Eye, FileText, Loader2, MoreHorizontal, Pen, Plus, Share2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  createCvAction,
  createShareLinkAction,
  deleteCvAction,
  duplicateCvAction,
  togglePublicAction,
} from "@/lib/actions/cv";
import { slugify } from "@/lib/utils";

export interface DashboardCv {
  id: string;
  title: string;
  template: string;
  updatedAt: string;
  isPublic: boolean;
  slug: string;
  shareTokens: Array<{ token: string; createdAt: string }>;
}

interface DashboardClientProps {
  initialCvs: DashboardCv[];
  userId: string;
}

export function DashboardClient({ initialCvs }: DashboardClientProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [cvs, setCvs] = React.useState(initialCvs);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const filtered = React.useMemo(() => {
    if (!search.trim()) {
      return cvs;
    }
    const term = search.toLowerCase();
    return cvs.filter((cv) => cv.title.toLowerCase().includes(term) || cv.template.toLowerCase().includes(term));
  }, [cvs, search]);

  const createCv = async () => {
    try {
      setCreating(true);
      const title = "New CV";
      const result = await createCvAction({ title, template: "CLASSIC" });
      if (!result.success) {
        toast({ title: "Unable to create CV", description: result.error });
        return;
      }
      router.push(`/editor/${result.data.id}`);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Could not create CV" });
    } finally {
      setCreating(false);
    }
  };

  const togglePublic = async (id: string, value: boolean) => {
    setPendingId(id);
    try {
      const result = await togglePublicAction(id, value);
      if (!result.success) {
        toast({ title: "Update failed", description: result.error });
        return;
      }
      setCvs((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                isPublic: result.data.isPublic,
              }
            : item,
        ),
      );
    } finally {
      setPendingId(null);
    }
  };

  const duplicateCv = async (id: string) => {
    setPendingId(id);
    try {
      const result = await duplicateCvAction(id);
      if (!result.success) {
        toast({ title: "Duplicate failed", description: result.error });
        return;
      }
      router.push(`/editor/${result.data.id}`);
    } finally {
      setPendingId(null);
    }
  };

  const deleteCv = async (id: string) => {
    if (!window.confirm("Delete this CV? This cannot be undone.")) {
      return;
    }
    setPendingId(id);
    try {
      const result = await deleteCvAction(id);
      if (!result.success) {
        toast({ title: "Delete failed", description: result.error });
        return;
      }
      setCvs((items) => items.filter((item) => item.id !== id));
    } finally {
      setPendingId(null);
    }
  };

  const createShareLink = async (cv: DashboardCv) => {
    setPendingId(cv.id);
    try {
      const result = await createShareLinkAction(cv.id);
      if (!result.success) {
        toast({ title: "Share link error", description: result.error });
        return;
      }
      const token = result.data.token;
      const url = `${origin}/u/${cv.slug}/cv/?token=${token}`;
      await navigator.clipboard.writeText(url);
      toast({ title: "Share link ready", description: "Copied to clipboard" });
      setCvs((items) =>
        items.map((item) =>
          item.id === cv.id
            ? {
                ...item,
                shareTokens: [{ token, createdAt: new Date().toISOString() }, ...(item.shareTokens ?? [])],
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);
      toast({ title: "Share link error", description: "Could not create share link" });
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-2">
          <h2 className="text-2xl font-semibold">Your resumes</h2>
          <p className="text-sm text-muted-foreground">
            Manage drafts, share read-only previews, and export PDFs from a single dashboard.
          </p>
        </div>
        <Button onClick={createCv} disabled={creating} className="w-full md:w-auto">
          {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}Create CV
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Input
            placeholder="Search CVs"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search CVs"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "document" : "documents"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No resumes yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Start by creating a CV with the button above or duplicate the demo document from the editor.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cv) => {
            const latestShareToken = cv.shareTokens?.[0]?.token;
            const shareUrl = latestShareToken ? `${origin}/u/${cv.slug}/cv/?token=${latestShareToken}` : null;

            return (
              <Card key={cv.id} className="flex h-full flex-col">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cv.title}</CardTitle>
                    <Badge variant="secondary">{cv.template.toLowerCase()}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(cv.updatedAt).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Public access</span>
                    <div className="flex items-center gap-2">
                      {pendingId === cv.id && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      <Switch
                        checked={cv.isPublic}
                        disabled={pendingId === cv.id}
                        onCheckedChange={(value: boolean) => togglePublic(cv.id, value)}
                        aria-label="Toggle public access"
                      />
                    </div>
                  </div>
                  {shareUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await navigator.clipboard.writeText(shareUrl);
                        toast({ title: "Link copied", description: "Share link copied to clipboard" });
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Copy share link
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => createShareLink(cv)}
                      disabled={pendingId === cv.id}
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Create share link
                    </Button>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/editor/${cv.id}`}>
                        <Pen className="mr-2 h-4 w-4" /> Edit
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/preview/${cv.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </a>
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => duplicateCv(cv.id)}>
                        <FileText className="mr-2 h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteCv(cv.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
