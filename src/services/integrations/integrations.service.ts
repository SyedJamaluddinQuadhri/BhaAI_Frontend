export interface Integration {
  id: string; name: string; provider: string; connected: boolean; lastSync: string; permissions: string[];
}
export const integrationsService = {
  async list(): Promise<Integration[]> {
    return [
      { id: "gmail", name: "Gmail", provider: "Google", connected: true, lastSync: "2 min ago", permissions: ["Read email metadata", "Read message content"] },
      { id: "gcal", name: "Google Calendar", provider: "Google", connected: true, lastSync: "5 min ago", permissions: ["Read events", "Create events with approval"] },
      { id: "outlook", name: "Microsoft Outlook", provider: "Microsoft", connected: false, lastSync: "Never", permissions: ["Read email"] },
      { id: "mcal", name: "Microsoft Calendar", provider: "Microsoft", connected: false, lastSync: "Never", permissions: ["Read events"] }
    ];
  }
};
