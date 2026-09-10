export interface Integration {
  id: string;
  name: string;
  provider: string;
  connected: boolean;
  lastSync: string;
  permissions: string[];
  description?: string;
  scopes?: string[];
}

const STORAGE_KEY = "bhaai_integrations";

const defaultIntegrations: Integration[] = [
  {
    id: "gmail",
    name: "Gmail",
    provider: "Google",
    connected: true,
    lastSync: "2 min ago",
    permissions: ["Read email metadata", "Read message content"],
    description: "Extracts bills, appointments, tickets, and deadlines directly into your life feed.",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly", "userinfo.email"],
  },
  {
    id: "gcal",
    name: "Google Calendar",
    provider: "Google",
    connected: true,
    lastSync: "5 min ago",
    permissions: ["Read events", "Create events with approval"],
    description: "Keeps your timeline and schedule synced so nothing overlaps.",
    scopes: ["https://www.googleapis.com/auth/calendar.events"],
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    provider: "Microsoft",
    connected: false,
    lastSync: "Never",
    permissions: ["Read email"],
    description: "Connect work or university Exchange accounts for unified intelligence.",
    scopes: ["Mail.Read", "User.Read"],
  },
  {
    id: "mcal",
    name: "Microsoft Calendar",
    provider: "Microsoft",
    connected: false,
    lastSync: "Never",
    permissions: ["Read events"],
    description: "Sync corporate meetings and academic schedules.",
    scopes: ["Calendars.ReadWrite"],
  },
];

function getStored(): Integration[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultIntegrations));
    return defaultIntegrations;
  }
  try {
    return JSON.parse(raw) as Integration[];
  } catch {
    return defaultIntegrations;
  }
}

function saveStored(items: Integration[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const integrationsService = {
  async list(): Promise<Integration[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getStored();
  },

  async toggleConnect(id: string): Promise<Integration | null> {
    const current = getStored();
    let updatedItem: Integration | null = null;
    const updated = current.map((item) => {
      if (item.id === id) {
        const nextConnected = !item.connected;
        updatedItem = {
          ...item,
          connected: nextConnected,
          lastSync: nextConnected ? "Just now" : "Disconnected",
        };
        return updatedItem;
      }
      return item;
    });
    saveStored(updated);
    return updatedItem;
  },

  async syncNow(id: string): Promise<Integration | null> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const current = getStored();
    let updatedItem: Integration | null = null;
    const updated = current.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          connected: true,
          lastSync: "Just now",
        };
        return updatedItem;
      }
      return item;
    });
    saveStored(updated);
    return updatedItem;
  },
};
