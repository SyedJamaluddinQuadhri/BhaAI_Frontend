import { CalendarDays, ArrowUpRight } from "lucide-react";

const items: [string, string, string][] = [
  ["14 Sep", "Internship application", "1 document missing"],
  ["16 Sep", "Electricity bill",        "₹1,842"],
  ["03 Oct", "LIC insurance renewal",   "Renew policy"],
  ["08 Oct", "Project report",          "University submission"],
];

export function UpcomingTimeline() {
  return (
    <div className="relative ml-2 border-l border-[var(--line)]">
      {items.map(([date, title, detail]) => (
        <div
          key={title}
          className="group relative grid gap-2 pl-8 pb-9 md:grid-cols-[130px_1fr]"
        >
          {/* timeline dot */}
          <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--text)]" />

          <div className="flex items-center gap-1.5 eyebrow">
            <CalendarDays size={12} />
            {date}
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">{title}</div>
              <div className="mt-1 text-sm muted">{detail}</div>
            </div>
            <ArrowUpRight
              size={16}
              className="mt-0.5 shrink-0 opacity-0 transition group-hover:opacity-60"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
