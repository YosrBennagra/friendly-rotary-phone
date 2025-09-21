"use client";

import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCVStore } from "@/lib/store";

const FONT_OPTIONS = ["Inter", "Manrope", "Merriweather", "Work Sans"];
const TEMPLATE_OPTIONS = [
  { value: "CLASSIC", label: "Classic" },
  { value: "MODERN", label: "Modern" },
  { value: "COMPACT", label: "Compact" },
];

export function ThemeControls() {
  const theme = useCVStore((state) => state.theme);
  const setTheme = useCVStore((state) => state.setTheme);
  const template = useCVStore((state) => state.template);
  const setTemplate = useCVStore((state) => state.setTemplate);
  const controlId = useId();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Appearance</h3>
        <p className="text-xs text-muted-foreground">Adjust typography, colors, and layout to match your personal brand.</p>
      </div>
      <div className="space-y-3 rounded-md border bg-background/80 p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Template</span>
          <select
            value={template}
            onChange={(event) => setTemplate(event.target.value as typeof template)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {TEMPLATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Font family</span>
          <select
            value={theme.fontFamily}
            onChange={(event) => setTheme({ fontFamily: event.target.value })}
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
              value={theme.accentColor}
              onChange={(event) => setTheme({ accentColor: event.target.value })}
              className="h-10 w-14 cursor-pointer"
              aria-label="Accent color"
            />
            <Input
              value={theme.accentColor}
              onChange={(event) => setTheme({ accentColor: event.target.value })}
              className="flex-1"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Spacing</span>
          <select
            value={theme.spacing}
            onChange={(event) => setTheme({ spacing: event.target.value as typeof theme.spacing })}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="compact">Compact</option>
            <option value="normal">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Layout</span>
          <select
            value={theme.layout}
            onChange={(event) => setTheme({ layout: event.target.value as typeof theme.layout })}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="single">Single column</option>
            <option value="double">Two column</option>
          </select>
        </label>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={theme.showIcons}
              onChange={(event) => setTheme({ showIcons: event.target.checked })}
            />
            Show section icons
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={theme.compactMode}
              onChange={(event) => setTheme({ compactMode: event.target.checked })}
            />
            Compact blocks
          </label>
        </div>
      </div>

      <Tabs defaultValue="one" value={theme.layout === "double" ? "two" : "one"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="one">Single column</TabsTrigger>
          <TabsTrigger value="two">Dual column</TabsTrigger>
        </TabsList>
        <TabsContent value="one">
          <div className="mt-2 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            A focused reading experience ideal for academic or traditional roles.
          </div>
        </TabsContent>
        <TabsContent value="two">
          <div className="mt-2 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            Highlight skills and quick facts in a sidebar while keeping experience prominent.
          </div>
        </TabsContent>
      </Tabs>
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
  showIcons: true,
  compactMode: false,
  layout: "single" as const,
};

