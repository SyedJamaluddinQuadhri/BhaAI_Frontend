import { mockEmails } from "../../mock/emails";
export const emailService = {
  async list() { return mockEmails; },
  async sync() { return { synced: mockEmails.length }; },
};
