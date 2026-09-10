export type CalendarEventType = "event" | "deadline" | "task" | "bill" | "reminder";

export interface CalendarEventItem {
  id: string;
  title: string;
  date: string; // ISO format "YYYY-MM-DD" e.g. "2026-09-10"
  start: string; // "10:00" or "All day"
  end: string;   // "11:00"
  type: CalendarEventType;
  description?: string;
  location?: string;
  priority?: "urgent" | "high" | "medium" | "low";
  source?: "google" | "gmail" | "vault" | "manual";
  completed?: boolean;
}

export type CalendarViewMode = "month" | "week" | "agenda";
