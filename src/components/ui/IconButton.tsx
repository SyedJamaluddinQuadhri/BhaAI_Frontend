import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
export function IconButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button aria-label={props["aria-label"]} className={cn("focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--text)] transition hover:bg-[var(--surface-2)]", className)} {...props} />;
}
