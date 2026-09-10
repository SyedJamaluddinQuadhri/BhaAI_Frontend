export const privacyService = {
  async get() {
    return { storage: "Encrypted", retention: "You control it", sessions: 2, auditEvents: 14 };
  }
};
