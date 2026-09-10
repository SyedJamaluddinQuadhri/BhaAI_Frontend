import type { Task } from "../types/common";

export const mockTasks: Task[] = [
  { id: "t1", title: "Upload internship certificate", deadline: "14 Sep", priority: "urgent", effort: "small", status: "in-progress", related: "Internship application" },
  { id: "t2", title: "Pay electricity bill", deadline: "16 Sep", priority: "high", effort: "small", status: "todo", related: "SBI receipt" },
  { id: "t3", title: "Finish project report", deadline: "08 Oct", priority: "medium", effort: "large", status: "todo", related: "University" },
  { id: "t4", title: "Renew insurance", deadline: "03 Oct", priority: "medium", effort: "medium", status: "todo", related: "LIC policy" }
];
