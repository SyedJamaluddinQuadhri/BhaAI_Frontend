import { FileText, Clock3, CreditCard, CalendarDays, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GlanceItem {
  icon: LucideIcon;
  title: string;
  detail: string;
  color: string;
  path: string;
}

const data: GlanceItem[] = [
  { icon: FileText, title: "Documents", detail: "12 important records", color: "var(--accent)", path: "/documents" },
  { icon: Clock3, title: "Deadlines", detail: "6 in the next 14 days", color: "var(--danger)", path: "/deadlines" },
  { icon: CreditCard, title: "Subscriptions", detail: "4 recurring payments", color: "var(--warning)", path: "/inbox" },
  { icon: CalendarDays, title: "Calendar", detail: "3 events today", color: "var(--teal)", path: "/calendar" },
];

export function GlanceSection() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {data.map(({ icon: Icon, title, detail, color, path }) => (
        <div
          key={title}
          onClick={() => navigate(path)}
          className="group flex cursor-pointer items-start gap-4 rounded-[16px] p-4 transition hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--line)]"
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
            <div className="font-semibold group-hover:text-[var(--accent)] transition">{title}</div>
            <div className="mt-0.5 text-sm muted">{detail}</div>
          </div>
          <ArrowUpRight
            size={16}
            className="mt-1 shrink-0 opacity-20 transition group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--accent)]"
          />
        </div>
      ))}
    </div>
  );
}
