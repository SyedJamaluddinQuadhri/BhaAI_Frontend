export interface CalendarEventItem {
  id: string;
  title: string;
  date: string; // ISO format "YYYY-MM-DD"
  start: string; // "10:00" or "All day"
  end: string;   // "11:00"
  type: "event" | "deadline" | "task" | "bill" | "reminder";
  description?: string;
  location?: string;
  priority?: "urgent" | "high" | "medium" | "low";
  source?: "google" | "gmail" | "vault" | "manual";
  completed?: boolean;
}

export const mockCalendar: CalendarEventItem[] = [
  {
    id: "c1",
    title: "Project team sync",
    date: "2026-09-10",
    start: "10:00",
    end: "11:00",
    type: "event",
    location: "Google Meet",
    description: "Weekly milestone review with college capstone team.",
    priority: "medium",
    source: "google",
  },
  {
    id: "c2",
    title: "Internship application deadline",
    date: "2026-09-14",
    start: "17:00",
    end: "17:00",
    type: "deadline",
    location: "Online Portal",
    description: "Upload final college certificate and verified marksheets.",
    priority: "urgent",
    source: "gmail",
  },
  {
    id: "c3",
    title: "Deep work — project report",
    date: "2026-09-11",
    start: "18:00",
    end: "19:30",
    type: "task",
    location: "Workspace",
    description: "BhaAI suggested 90-min focus window to draft section 3.",
    priority: "high",
    source: "manual",
  },
  {
    id: "c4",
    title: "Electricity bill payment (₹1,842)",
    date: "2026-09-16",
    start: "All day",
    end: "All day",
    type: "bill",
    location: "SBI NetBanking",
    description: "Detected from SBI Alerts in Gmail. Due date 16 September.",
    priority: "high",
    source: "gmail",
  },
  {
    id: "c5",
    title: "Mock technical interview",
    date: "2026-09-22",
    start: "15:00",
    end: "16:00",
    type: "event",
    location: "Zoom",
    description: "Placement prep with campus alumni mentor.",
    priority: "medium",
    source: "google",
  },
  {
    id: "c6",
    title: "LIC Insurance renewal reminder",
    date: "2026-10-03",
    start: "All day",
    end: "All day",
    type: "deadline",
    location: "LIC Portal",
    description: "Annual policy premium payment before expiry date.",
    priority: "urgent",
    source: "vault",
  },
  {
    id: "c7",
    title: "Review semester course materials",
    date: "2026-09-10",
    start: "14:00",
    end: "15:00",
    type: "task",
    location: "Library",
    description: "Read chapters 4 and 5 for distributed computing.",
    priority: "low",
    source: "manual",
  },
];
