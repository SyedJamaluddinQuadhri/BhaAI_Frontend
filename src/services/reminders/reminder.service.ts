export interface ReminderItem {
  id: string;
  title: string;
  when: string;
  channel: string;
  status: "scheduled" | "completed" | "snoozed";
  source?: string;
}

const STORAGE_KEY = "bhaai_reminders";

const defaultReminders: ReminderItem[] = [
  {
    id: "r1",
    title: "Insurance renewal",
    when: "30 Sep · 9:00 AM",
    channel: "Push + Calendar",
    status: "scheduled",
    source: "LIC Policy",
  },
  {
    id: "r2",
    title: "Electricity bill",
    when: "15 Sep · 9:00 AM",
    channel: "Push",
    status: "scheduled",
    source: "SBI Utility Receipt",
  },
  {
    id: "r3",
    title: "Internship application",
    when: "12 Sep · 6:00 PM",
    channel: "Push + Email",
    status: "scheduled",
    source: "Google Careers",
  },
];

function getStoredReminders(): ReminderItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReminders));
    return defaultReminders;
  }
  try {
    return JSON.parse(raw) as ReminderItem[];
  } catch {
    return defaultReminders;
  }
}

function saveReminders(items: ReminderItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const reminderService = {
  async list(): Promise<ReminderItem[]> {
    await new Promise((r) => setTimeout(r, 100));
    return getStoredReminders();
  },

  async create(data: Omit<ReminderItem, "id" | "status">): Promise<ReminderItem> {
    const newItem: ReminderItem = {
      ...data,
      id: `r_${crypto.randomUUID().slice(0, 8)}`,
      status: "scheduled",
    };
    const current = getStoredReminders();
    const updated = [newItem, ...current];
    saveReminders(updated);
    return newItem;
  },

  async update(id: string, updates: Partial<ReminderItem>): Promise<ReminderItem | null> {
    const current = getStoredReminders();
    let updatedItem: ReminderItem | null = null;
    const updated = current.map((r) => {
      if (r.id === id) {
        updatedItem = { ...r, ...updates };
        return updatedItem;
      }
      return r;
    });
    saveReminders(updated);
    return updatedItem;
  },

  async toggleComplete(id: string): Promise<ReminderItem | null> {
    const current = getStoredReminders();
    let updatedItem: ReminderItem | null = null;
    const updated = current.map((r) => {
      if (r.id === id) {
        const nextStatus = r.status === "completed" ? "scheduled" : "completed";
        updatedItem = { ...r, status: nextStatus };
        return updatedItem;
      }
      return r;
    });
    saveReminders(updated);
    return updatedItem;
  },

  async snooze(id: string, hours: number = 24): Promise<ReminderItem | null> {
    const current = getStoredReminders();
    let updatedItem: ReminderItem | null = null;
    const updated = current.map((r) => {
      if (r.id === id) {
        const snoozeWhen = `Tomorrow · 9:00 AM`;
        updatedItem = { ...r, when: snoozeWhen, status: "snoozed" as const };
        return updatedItem;
      }
      return r;
    });
    saveReminders(updated);
    return updatedItem;
  },

  async delete(id: string): Promise<boolean> {
    const current = getStoredReminders();
    const filtered = current.filter((r) => r.id !== id);
    saveReminders(filtered);
    return true;
  },
};

