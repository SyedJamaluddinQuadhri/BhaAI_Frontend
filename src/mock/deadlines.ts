import type { Deadline } from "../types/common";

export const mockDeadlines: Deadline[] = [
  { id: "d1", title: "Internship application", date: "14 Sep 2026", source: "Internship email", priority: "urgent", action: "Upload final certificate", status: "in-progress" },
  { id: "d2", title: "Electricity bill", date: "16 Sep 2026", source: "SBI payment receipt", priority: "high", action: "Pay ₹1,842", status: "todo" },
  { id: "d3", title: "LIC policy renewal", date: "03 Oct 2026", source: "LIC Insurance Policy · Page 4", priority: "medium", action: "Renew policy", status: "todo" },
  { id: "d4", title: "Project report", date: "08 Oct 2026", source: "University portal email", priority: "medium", action: "Submit PDF", status: "todo" }
];
