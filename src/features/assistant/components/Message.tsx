import type { AIMessage } from "../../../services/ai/ai.service";
export function Message({ message }: { message: AIMessage }) {
  const user = message.role === "user";
  return <div className={`flex ${user ? "justify-end" : "justify-start"}`}><div className={`${user ? "max-w-[80%] bg-[var(--text)] text-[var(--bg)]" : "max-w-[88%] bg-[var(--surface-2)]"} rounded-[18px] px-4 py-3 text-sm leading-6`}>{message.content}</div></div>;
}
