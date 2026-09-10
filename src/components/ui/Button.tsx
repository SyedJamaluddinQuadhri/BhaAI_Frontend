import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}
export function Button({ className, variant = "primary", ...props }: Props) {
  const styles = {
    primary: "bg-[var(--text)] text-[var(--bg)] hover:opacity-85",
    secondary: "bg-[var(--surface-2)] text-[var(--text)] hover:opacity-80",
    ghost: "text-[var(--text)] hover:bg-[var(--surface-2)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-85",
  };
  return <button className={cn("focus-ring inline-flex items-center justify-center gap-2 rounded-[12px] px-4 py-2.5 text-sm font-semibold transition", styles[variant], className)} {...props} />;
}
