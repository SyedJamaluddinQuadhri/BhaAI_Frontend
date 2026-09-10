import type { CalendarEventItem } from "../types";

interface Props {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEventItem[];
  onSelectDate: (date: Date) => void;
  onAddEventOnDate: (date: Date) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  currentDate,
  selectedDate,
  events,
  onSelectDate,
  onAddEventOnDate,
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Today reference (2026-09-10 or actual today)
  const today = new Date(2026, 8, 10);
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // First day of month and total days
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Build 42 grid cells
  const calendarCells: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month padding to fill out 35 or 42 cells
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    calendarCells.push({
      date: new Date(year, month + 1, d),
      isCurrentMonth: false,
    });
  }

  const formatISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const getEventsForDate = (d: Date) => {
    const iso = formatISODate(d);
    return events.filter((e) => e.date === iso);
  };

  const getTypeStyle = (type: CalendarEventItem["type"]) => {
    switch (type) {
      case "deadline":
        return "bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/30";
      case "bill":
        return "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30";
      case "task":
        return "bg-[var(--teal)]/15 text-[var(--teal)] border-[var(--teal)]/30";
      case "event":
      default:
        return "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/30";
    }
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)] shadow-sm">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-[var(--line)] bg-[var(--surface-2)] text-center text-xs font-semibold text-[var(--muted)] py-3">
        {WEEKDAYS.map((w) => (
          <div key={w} className="tracking-wider uppercase text-[11px]">
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-[var(--line)] bg-[var(--surface)]">
        {calendarCells.map(({ date, isCurrentMonth }, idx) => {
          const dayEvents = getEventsForDate(date);
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <div
              key={idx}
              onClick={() => onSelectDate(date)}
              onDoubleClick={() => onAddEventOnDate(date)}
              className={`group relative min-h-[110px] p-2 sm:p-2.5 transition cursor-pointer ${
                !isCurrentMonth ? "opacity-35 bg-[var(--surface-2)]/40" : "hover:bg-[var(--surface-2)]/60"
              } ${isSelected ? "ring-2 ring-inset ring-[var(--accent)] bg-[var(--accent-soft)]/20" : ""}`}
            >
              {/* Day Number Row */}
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
                    isToday
                      ? "bg-[var(--text)] text-[var(--bg)] font-bold shadow-sm"
                      : isSelected
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text)]"
                  }`}
                >
                  {date.getDate()}
                </span>

                {isToday && (
                  <span className="hidden sm:inline-block rounded-full bg-[var(--accent-soft)] px-1.5 py-0.5 text-[9px] font-bold text-[var(--accent)]">
                    TODAY
                  </span>
                )}
              </div>

              {/* Event Pills */}
              <div className="mt-2 space-y-1">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    title={`${ev.start} ${ev.title}`}
                    className={`truncate rounded-[6px] border px-1.5 py-0.5 text-[10px] font-medium leading-tight ${getTypeStyle(
                      ev.type
                    )}`}
                  >
                    <span className="font-semibold mr-1">{ev.start !== "All day" ? ev.start : "•"}</span>
                    <span>{ev.title}</span>
                  </div>
                ))}

                {dayEvents.length > 2 && (
                  <div className="text-[10px] font-semibold text-[var(--muted)] pl-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
