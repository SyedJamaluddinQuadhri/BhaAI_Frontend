export const knowledgeService = {
  async search(query: string) {
    return { query, results: ["LIC Insurance Policy", "LIC renewal email", "Renew insurance task"] };
  }
};
