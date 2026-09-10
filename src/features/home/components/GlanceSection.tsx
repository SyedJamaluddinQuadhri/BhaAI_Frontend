import { FileText, Clock3, CreditCard, CalendarDays, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const data: [LucideIcon, string, string, string][] = [
  [FileText,     "Documents",      "12 important records",   "var(--accent)"],
  [Clock3,       "Deadlines",      "6 in the next 14 days",  "var(--danger)"],
  [CreditCard,   "Subscriptions",  "4 recurring payments",   "var(--warning)"],
  [CalendarDays, "Calendar",       "3 events today",         "var(--teal)"],
];

export function GlanceSection() {
  return (
    <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {data.map(([Icon, title, detail, color]) => (
        <div
          key={title}
          className="group flex cursor-pointer items-start gap-4 rounded-[16px] p-4 transition hover:bg-[var(--surface-2)]"
        >
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]"
            style={{
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
              color,
            }}
          >
            <Icon size={18} />
          </div>
          <div className="flex-1">
            <div className="font-semibold">{title}</div>
            <div className="mt-0.5 text-sm muted">{detail}</div>
          </div>
          <ArrowUpRight
            size={15}
            className="mt-1 shrink-0 opacity-0 transition group-hover:opacity-50"
          />
        </div>
      ))}
    </div>
  );
}
