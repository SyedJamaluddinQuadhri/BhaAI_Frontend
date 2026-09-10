import type { NotificationType } from "../types/common";

export interface MockNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export const mockNotifications: MockNotification[] = [
  { id: "n1", type: "urgent", title: "Internship deadline approaching", body: "One required certificate is still missing.", time: "12 min ago", unread: true },
  { id: "n2", type: "reminder", title: "Electricity bill", body: "Payment is due in 6 days.", time: "2 hr ago", unread: true },
  { id: "n3", type: "ai", title: "BhaAI suggestion", body: "Tomorrow has a free 90-minute window for your project report.", time: "Yesterday", unread: false }
];
