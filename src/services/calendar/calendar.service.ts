import { mockCalendar, type CalendarEventItem } from "../../mock/calendar";

const STORAGE_KEY = "bhaai_calendar_events";

function getStoredEvents(): CalendarEventItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCalendar));
    return mockCalendar;
  }
  try {
    return JSON.parse(raw) as CalendarEventItem[];
  } catch {
    return mockCalendar;
  }
}

export const calendarService = {
  async list(): Promise<CalendarEventItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getStoredEvents();
  },

  async add(event: Omit<CalendarEventItem, "id">): Promise<CalendarEventItem> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newEvent: CalendarEventItem = {
      ...event,
      id: `c_${crypto.randomUUID().slice(0, 8)}`,
    };
    const current = getStoredEvents();
    const updated = [newEvent, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEvent;
  },

  async delete(id: string): Promise<boolean> {
    const current = getStoredEvents();
    const filtered = current.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
