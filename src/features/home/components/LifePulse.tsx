import { AlertTriangle, Clock, AlertCircle } from "lucide-react";

const stats: [typeof AlertTriangle, string, string, string][] = [
  [AlertTriangle, "3", "urgent",   "var(--danger)"],
  [Clock,         "5", "upcoming", "var(--warning)"],
  [AlertCircle,   "1", "overdue",  "var(--muted)"],
];

export function LifePulse() {
  return (
    <div className="grid gap-8 border-y border-[var(--line)] py-8 sm:grid-cols-3">
      {stats.map(([Icon, number, label, color]) => (
        <div key={label} className="flex items-center gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
            style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
          >
            <Icon size={20} />
          </div>
          <div>
            <div className="text-4xl font-semibold">{number}</div>
            <div className="mt-0.5 text-sm muted">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
