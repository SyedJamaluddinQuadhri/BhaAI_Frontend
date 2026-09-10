export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "in-progress" | "done" | "overdue";
export type NotificationType = "urgent" | "important" | "reminder" | "ai" | "system";

export interface SourceReference {
  label: string;
  detail: string;
  confidence?: number;
}

export interface Deadline {
  id: string;
  title: string;
  date: string;
  source: string;
  priority: Priority;
  action: string;
  status: Status;
}

export interface Task {
  id: string;
  title: string;
  deadline?: string;
  priority: Priority;
  effort: "small" | "medium" | "large";
  status: Status;
  related?: string;
}

export interface Document {
  id: string;
  name: string;
  category: string;
  type: string;
  importantDate: string;
  expiry?: string;
  action?: string;
  location: string;
  relatedEmail?: string;
  relatedTask?: string;
  summary: string;
  entities: string[];
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  summary: string;
  category: string;
  date: string;
  action?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: "event" | "deadline" | "task";
}
