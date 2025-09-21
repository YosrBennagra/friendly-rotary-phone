"use client";

import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCVStore } from "@/lib/store";

const FONT_OPTIONS = ["Inter", "Manrope", "Merriweather", "Work Sans"];

export function ThemeControls() {
  const theme = useCVStore((state) => state.theme);
  const setTheme = useCVStore((state) => state.setTheme);
  // Single-template: Modern only; template selection removed
  const controlId = useId();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Appearance</h3>
        <p className="text-xs text-muted-foreground">Adjust typography, colors, and layout to match your personal brand.</p>
      </div>
      <div className="space-y-3 rounded-md border bg-background/80 p-4 shadow-sm">
        {/* Template selection removed: Only Modern is supported */}
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Font family</span>
          <select
            value={theme.fontFamily || "Inter"}
            onChange={(event) => setTheme({ fontFamily: event.target.value || "Inter" })}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Accent color</span>
          <div className="flex items-center gap-2">
            <Input
              id={`${controlId}-accent`}
              type="color"
              value={theme.accentColor || "#3b82f6"}
              onChange={(event) => setTheme({ accentColor: event.target.value || "#3b82f6" })}
              className="h-10 w-14 cursor-pointer"
              aria-label="Accent color"
            />
            <Input
              value={theme.accentColor || "#3b82f6"}
              onChange={(event) => setTheme({ accentColor: event.target.value || "#3b82f6" })}
              className="flex-1"
            />
          </div>
        </label>
        {/* ATS-only: spacing/layout/icons are fixed for parser friendliness. */}
      </div>
      {/* ATS-only: remove layout tabs */}
      <Button variant="outline" size="sm" onClick={() => setTheme({ ...defaultTheme })}>
        Reset theme
      </Button>
    </div>
  );
}

const defaultTheme = {
  fontFamily: "Inter",
  accentColor: "#3b82f6",
  spacing: "normal" as const,
  showIcons: false,
  compactMode: false,
  layout: "single" as const,
};

