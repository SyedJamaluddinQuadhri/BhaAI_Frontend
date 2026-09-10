import type { AIMessage } from "../services/ai/ai.service";
export const initialMessages: AIMessage[] = [
  { id: "welcome", role: "assistant", content: "Hey. I’m BhaAI. Ask me about your documents, deadlines, inbox, or what needs your attention." }
];
