export const reminderService = {
  async create(title: string, when: string) {
    return { id: crypto.randomUUID(), title, when, status: "scheduled" };
  }
};
