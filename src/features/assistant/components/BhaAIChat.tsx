import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { WorkflowStatus } from "./WorkflowStatus";
import { initialMessages } from "../../../state/assistant.store";
import { aiService } from "../../../services/ai/ai.service";
import type { AIMessage } from "../../../services/ai/ai.service";

export function BhaAIChat({
  onClose,
  seedPrompt,
}: {
  onClose: () => void;
  seedPrompt?: string;
}) {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [thinking, setThinking] = useState(false);
  const didSeed = useRef(false);

  const send = async (text: string) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: text }]);
    setThinking(true);
    await new Promise((r) => setTimeout(r, 500));
    const answer = await aiService.chat(text);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: answer.text, sources: answer.sources }]);
    setThinking(false);
  };

  // Fire seed prompt once on mount
  useEffect(() => {
    if (seedPrompt && !didSeed.current) {
      didSeed.current = true;
      send(seedPrompt);
    }
  }, [seedPrompt]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 10 }}
      transition={{ duration: 0.2 }}
      className="flex h-[600px] flex-col overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-soft)]"
    >
      <ChatHeader onClose={onClose} onMinimize={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <MessageList messages={messages} />
        {thinking && (
          <div className="mt-4 text-xs muted">Reading your information…</div>
        )}
        <div className="mt-5">
          <WorkflowStatus active={thinking} />
        </div>
      </div>
      <ChatInput onSend={send} />
    </motion.div>
  );
}
