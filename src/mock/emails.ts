import type { Email } from "../types/common";

export const mockEmails: Email[] = [
  { id: "e1", sender: "Campus Placement Office", subject: "Internship application — final documents", summary: "Final certificate must be uploaded before 14 September.", category: "Deadline", date: "Today", action: "Upload certificate" },
  { id: "e2", sender: "SBI Alerts", subject: "Electricity bill generated", summary: "Your electricity payment of ₹1,842 is due on 16 September.", category: "Bill", date: "Yesterday", action: "Pay bill" },
  { id: "e3", sender: "LIC", subject: "Policy renewal reminder", summary: "Annual policy renewal is due on 3 October 2026.", category: "Insurance", date: "05 Sep", action: "Renew policy" },
  { id: "e4", sender: "Amazon India", subject: "Your order has been delivered", summary: "Order delivered. Receipt is available for your records.", category: "Receipt", date: "04 Sep" }
];
