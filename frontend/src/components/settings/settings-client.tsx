"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { updateProfileAction, deleteAccountAction } from "@/lib/actions/user";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  image: z.string().url("Provide a valid URL").or(z.literal("")),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface SettingsClientProps {
  profile: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
}

export function SettingsClient({ profile }: SettingsClientProps) {
  const router = useRouter();
  const [isDeleting, startDelete] = React.useTransition();
  const [isUpdating, startUpdate] = React.useTransition();
  const [isExporting, setIsExporting] = React.useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      image: profile?.image ?? "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startUpdate(async () => {
      const result = await updateProfileAction(values);
      if (!result.success) {
        toast({ title: "Update failed", description: result.error });
        return;
      }
      toast({ title: "Profile updated" });
      router.refresh();
    });
  });

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const response = await fetch("/api/account/export");
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "cv-builder-export.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast({ title: "Export failed", description: "Unable to download data." });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = () => {
    startDelete(async () => {
      if (!window.confirm("Delete account and all CVs?")) {
        return;
      }
      const result = await deleteAccountAction();
      if (!result.success) {
        toast({ title: "Delete failed", description: result.error });
        return;
      }
      toast({ title: "Account deleted" });
      await signOut({ callbackUrl: "/" });
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Your name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input placeholder="https://" {...form.register("image")} />
              {form.formState.errors.image && (
                <p className="text-xs text-destructive">{form.formState.errors.image.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Account tools</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
