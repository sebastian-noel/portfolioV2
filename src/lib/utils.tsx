import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ReactNode } from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Converts **text** markers in a string into bold spans.
// Keeps data files readable while allowing inline emphasis.
export function parseBold(text: string): ReactNode[] {
  return text.split(/(\*\*.*?\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-accent">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}
