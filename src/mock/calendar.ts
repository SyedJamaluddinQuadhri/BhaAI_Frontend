import type { CalendarEvent } from "../types/common";

export const mockCalendar: CalendarEvent[] = [
  { id: "c1", title: "Project team sync", start: "10:00", end: "11:00", type: "event" },
  { id: "c2", title: "Internship application", start: "14 Sep", end: "14 Sep", type: "deadline" },
  { id: "c3", title: "Deep work — project report", start: "18:00", end: "19:30", type: "task" },
  { id: "c4", title: "Electricity bill", start: "16 Sep", end: "16 Sep", type: "deadline" }
];
