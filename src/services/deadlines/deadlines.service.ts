import { mockDeadlines } from "../../mock/deadlines";
import type { Deadline, Priority, Status } from "../../types/common";

const STORAGE_KEY = "bhaai_deadlines";

function getStoredDeadlines(): Deadline[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDeadlines));
    return mockDeadlines;
  }
  try {
    return JSON.parse(raw) as Deadline[];
  } catch {
    return mockDeadlines;
  }
}

function saveDeadlines(items: Deadline[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const deadlinesService = {
  async list(): Promise<Deadline[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getStoredDeadlines();
  },

  async add(deadline: Omit<Deadline, "id">): Promise<Deadline> {
    const newDeadline: Deadline = {
      ...deadline,
      id: `d_${crypto.randomUUID().slice(0, 8)}`,
    };
    const current = getStoredDeadlines();
    const updated = [newDeadline, ...current];
    saveDeadlines(updated);
    return newDeadline;
  },

  async toggleStatus(id: string): Promise<Deadline | null> {
    const current = getStoredDeadlines();
    let updatedItem: Deadline | null = null;
    const updated = current.map((d) => {
      if (d.id === id) {
        const nextStatus: Status = d.status === "done" ? "todo" : "done";
        updatedItem = { ...d, status: nextStatus };
        return updatedItem;
      }
      return d;
    });
    saveDeadlines(updated);
    return updatedItem;
  },

  async delete(id: string): Promise<boolean> {
    const current = getStoredDeadlines();
    const filtered = current.filter((d) => d.id !== id);
    saveDeadlines(filtered);
    return true;
  },
};
