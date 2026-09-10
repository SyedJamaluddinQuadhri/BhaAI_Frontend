import {
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  Calendar as CalendarIcon,
} from "lucide-react";
import type { CalendarEventItem } from "../types";
import { Button } from "../../../components/ui/Button";

interface Props {
  selectedDate: Date;
  events: CalendarEventItem[];
  onAddEvent: (date: Date) => void;
  onDeleteEvent: (id: string) => void;
  onScheduleFocusWindow: (date: Date) => void;
}

export function CalendarDayInspector({
  selectedDate,
  events,
  onAddEvent,
  onDeleteEvent,
  onScheduleFocusWindow,
}: Props) {
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const isoDate = `${year}-${month}-${day}`;

  const dayEvents = events.filter((e) => e.date === isoDate);

  const getBadgeInfo = (type: CalendarEventItem["type"]) => {
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

  return (
    <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[var(--line)] pb-4">
        <div>
          <div className="eyebrow flex items-center gap-1.5 text-[var(--muted)]">
            <CalendarDays size={13} /> Selected Schedule
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-[var(--text)]">
            {formattedDate}
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {dayEvents.length} {dayEvents.length === 1 ? "item" : "items"} scheduled for this date
          </p>
        </div>

        <button
          onClick={() => onAddEvent(selectedDate)}
          className="flex items-center gap-1.5 rounded-[10px] bg-[var(--text)] px-3 py-1.5 text-xs font-semibold text-[var(--bg)] transition hover:opacity-85 shadow-sm"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Events Timeline */}
      <div className="space-y-3">
        {dayEvents.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[var(--line)] p-6 text-center">
            <CalendarDays size={24} className="mx-auto text-[var(--muted)] opacity-50 mb-2" />
            <div className="text-xs font-semibold text-[var(--text)]">Clear schedule</div>
            <p className="text-[11px] text-[var(--muted)] mt-1">
              No meetings or deadlines detected on this day.
            </p>
            <button
              onClick={() => onAddEvent(selectedDate)}
              className="mt-3 text-xs font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              <Plus size={12} /> Schedule an item
            </button>
          </div>
        ) : (
          dayEvents.map((ev) => {
            const badge = getBadgeInfo(ev.type);
            const Icon = badge.icon;
            return (
              <div
                key={ev.id}
                className="group relative rounded-[14px] border border-[var(--line)] bg-[var(--bg)] p-3.5 transition hover:border-[var(--accent)] hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
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

                  <button
                    onClick={() => onDeleteEvent(ev.id)}
                    title="Delete item"
                    className="opacity-0 group-hover:opacity-100 transition text-[var(--muted)] hover:text-[var(--danger)]"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <h4 className="mt-2 text-sm font-semibold text-[var(--text)]">{ev.title}</h4>

                {ev.description && (
                  <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
                    {ev.description}
                  </p>
                )}

                {ev.location && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-[var(--muted)]">
                    <MapPin size={11} className="text-[var(--accent)]" />
                    <span>{ev.location}</span>
                    {ev.source && (
                      <span className="ml-auto rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-[9px] font-mono capitalize">
                        {ev.source}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* BhaAI Smart Suggestion */}
      <div className="rounded-[16px] border border-[var(--accent)]/30 bg-[var(--accent-soft)]/25 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
          <Sparkles size={15} />
          <span>BhaAI Schedule Intelligence</span>
        </div>
        <p className="text-xs text-[var(--text)] leading-relaxed">
          You have a <strong>90-minute open window</strong> at 6:00 PM on this date. It's a great
          time to finalize your internship documentation before the submission deadline.
        </p>
        <Button
          variant="secondary"
          onClick={() => onScheduleFocusWindow(selectedDate)}
          className="w-full text-xs py-2 bg-[var(--surface)] text-[var(--accent)] hover:bg-[var(--surface-2)]"
        >
          <Sparkles size={13} />
          Auto-block 90m focus slot
        </Button>
      </div>
    </div>
  );
}
