import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start && !end) {
    return "";
  }
  const startLabel = start ?? "";
  const endLabel = end ?? "Present";
  if (!startLabel) {
    return endLabel;
  }
  return `${startLabel} - ${endLabel}`;
}

export function assertUnreachable(value: never): never {
  throw new Error(`Unhandled value: ${String(value)}`);
}
