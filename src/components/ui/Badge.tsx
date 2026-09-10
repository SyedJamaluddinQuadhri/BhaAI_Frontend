import type { ReactNode } from "react";
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral"|"accent"|"success"|"warning"|"danger" }) {
  const tones = { neutral: "bg-[var(--surface-2)] text-[var(--muted)]", accent: "bg-[var(--accent-soft)] text-[var(--accent)]", success: "bg-[#377a5215] text-[var(--success)]", warning: "bg-[#9a6a2815] text-[var(--warning)]", danger: "bg-[#a34b4b15] text-[var(--danger)]" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}
