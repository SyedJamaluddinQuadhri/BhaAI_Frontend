import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

const items: [string, string, boolean][] = [
  ["Submit internship application", "Today", false],
  ["Pay electricity bill", "Today", false],
  ["Complete project report", "Today", true],
];

export function TodaySection() {
  return (
    <div className="space-y-0">
      {items.map(([title, when, done]) => (
        <div
          key={title}
          className="group flex items-center gap-4 border-b border-[var(--line)] py-5"
        >
          {done ? (
            <CheckCircle2 size={19} className="text-[var(--success)] shrink-0" />
          ) : (
            <Circle size={19} className="muted shrink-0" />
          )}
          <div className={`flex-1 text-base font-medium ${done ? "line-through muted" : ""}`}>
            {title}
          </div>
          <span className="text-xs muted">{when}</span>
          <ChevronRight
            size={16}
            className="translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 muted"
          />
        </div>
      ))}
    </div>
  );
}
