import { CalendarDays, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TimelineItem {
  date: string;
  title: string;
  detail: string;
  path: string;
}

const items: TimelineItem[] = [
  { date: "14 Sep", title: "Internship application", detail: "1 document missing", path: "/documents" },
  { date: "16 Sep", title: "Electricity bill", detail: "₹1,842", path: "/inbox" },
  { date: "03 Oct", title: "LIC insurance renewal", detail: "Renew policy", path: "/documents/d1" },
  { date: "08 Oct", title: "Project report", detail: "University submission", path: "/tasks" },
];

export function UpcomingTimeline() {
  const navigate = useNavigate();

  return (
    <div className="relative ml-2 border-l border-[var(--line)]">
      {items.map((item) => (
        <div
          key={item.title}
          onClick={() => navigate(item.path)}
          className="group relative grid gap-2 pl-8 pb-9 md:grid-cols-[130px_1fr] cursor-pointer"
        >
          {/* timeline dot */}
          <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--text)] transition-transform group-hover:scale-125" />

          <div className="flex items-center gap-1.5 eyebrow group-hover:text-[var(--text)] transition">
            <CalendarDays size={12} />
            {item.date}
          </div>

          <div className="flex items-start justify-between gap-4 rounded-[12px] p-2 -m-2 group-hover:bg-[var(--surface-2)]/50 transition">
            <div>
              <div className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition">
                {item.title}
              </div>
              <div className="mt-1 text-sm muted">{item.detail}</div>
            </div>
            <ArrowUpRight
              size={16}
              className="mt-0.5 shrink-0 opacity-40 transition group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--accent)]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
