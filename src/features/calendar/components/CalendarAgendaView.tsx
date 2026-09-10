import {
  CalendarDays,
  Clock3,
  MapPin,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Calendar as CalendarIcon,
  Trash2,
} from "lucide-react";
import type { CalendarEventItem } from "../types";

interface Props {
  events: CalendarEventItem[];
  onDeleteEvent: (id: string) => void;
  onSelectEventDate: (dateStr: string) => void;
}

export function CalendarAgendaView({ events, onDeleteEvent, onSelectEventDate }: Props) {
  // Sort events chronologically
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  // Group by date
  const grouped: Record<string, CalendarEventItem[]> = {};
  for (const ev of sorted) {
    if (!grouped[ev.date]) grouped[ev.date] = [];
    grouped[ev.date].push(ev);
  }

  const formatHeader = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeBadge = (type: CalendarEventItem["type"]) => {
    switch (type) {
      case "deadline":
        return {
          label: "Deadline",
          icon: AlertCircle,
          color: "var(--danger)",
          bg: "rgba(163,75,75,.12)",
        };
      case "bill":
        return {
          label: "Bill",
          icon: CreditCard,
          color: "var(--warning)",
          bg: "rgba(154,106,40,.12)",
        };
      case "task":
        return {
          label: "Task",
          icon: CheckCircle2,
          color: "var(--teal)",
          bg: "rgba(23,124,114,.12)",
        };
      case "event":
      default:
        return {
          label: "Event",
          icon: CalendarIcon,
          color: "var(--accent)",
          bg: "var(--accent-soft)",
        };
    }
  };

  if (sorted.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-12 text-center">
        <CalendarDays size={32} className="mx-auto text-[var(--muted)] mb-3 opacity-60" />
        <h3 className="text-base font-semibold text-[var(--text)]">No events scheduled</h3>
        <p className="text-xs text-[var(--muted)] mt-1">
          Your schedule is completely clear. Add an event or sync with Google Calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([dateStr, dayEvents]) => (
        <div
          key={dateStr}
          className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm"
        >
          {/* Group Header */}
          <div
            onClick={() => onSelectEventDate(dateStr)}
            className="flex items-center justify-between border-b border-[var(--line)] pb-3 cursor-pointer hover:opacity-80 transition"
          >
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[var(--accent)]" />
              <span className="text-sm font-bold text-[var(--text)]">{formatHeader(dateStr)}</span>
            </div>
            <span className="text-xs text-[var(--muted)] font-medium">
              {dayEvents.length} {dayEvents.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Events list */}
          <div className="divide-y divide-[var(--line)]">
            {dayEvents.map((ev) => {
              const badge = getTypeBadge(ev.type);
              const Icon = badge.icon;
              return (
                <div
                  key={ev.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 transition"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: badge.bg, color: badge.color }}
                      >
                        <Icon size={11} />
                        {badge.label}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-[var(--muted)]">
                        <Clock3 size={12} />
                        {ev.start} {ev.end && ev.end !== ev.start ? `– ${ev.end}` : ""}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-[var(--text)]">{ev.title}</h4>

                    {ev.description && (
                      <p className="text-xs text-[var(--muted)] leading-relaxed max-w-xl">
                        {ev.description}
                      </p>
                    )}

                    {ev.location && (
                      <div className="flex items-center gap-1 text-[11px] text-[var(--muted)] pt-0.5">
                        <MapPin size={11} className="text-[var(--accent)]" />
                        <span>{ev.location}</span>
                        {ev.source && (
                          <span className="ml-2 rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[9px] font-mono capitalize">
                            via {ev.source}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      title="Delete event"
                      className="rounded-[8px] p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--danger)] transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
