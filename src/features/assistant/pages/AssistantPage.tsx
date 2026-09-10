import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import {
  Sparkles,
  ArrowUp,
  RotateCcw,
  PanelRightClose,
  PanelRightOpen,
  Mail,
  FileText,
  Clock3,
  Copy,
  Check,
  CheckSquare,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { aiService, type AIMessage } from "../../../services/ai/ai.service";
import { authService } from "../../../services/auth/auth.service";

const initialChatMessages: AIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hey Jamal, I’m BhaAI. I’m connected to your Gmail (`jamal.ahmed@gmail.com`), calendar, and document vault.\n\nAsk me anything about your emails, upcoming deadlines, bills, or tasks.",
    sources: [
      { type: "gmail", title: "Gmail Gateway", detail: "4 emails indexed" },
      { type: "doc", title: "Vault", detail: "12 documents" },
    ],
    timestamp: "Just now",
  },
];

const starterPrompts = [
  { label: "Check my connected Gmail inbox", query: "What emails are in my Gmail?" },
  { label: "What is my most urgent deadline?", query: "What is my most urgent deadline?" },
  { label: "When does my LIC insurance expire?", query: "When does my LIC insurance policy expire?" },
  { label: "Do I have any pending bills to pay?", query: "Do I have any electricity or other bills to pay?" },
  { label: "What should I focus on today?", query: "What are my priorities today?" },
];

export function AssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>(initialChatMessages);
  const [inputValue, setInputValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [contextDrawerOpen, setContextDrawerOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const session = authService.getSession();
  const gmailAddress = session?.user?.gmailAddress || "jamal.ahmed@gmail.com";

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Send message handler
  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || thinking) return;

    const userMsg: AIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setThinking(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await new Promise((r) => setTimeout(r, 650));
      const response = await aiService.chat(text);

      const assistantMsg: AIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.text,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I had trouble scanning your context. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages(initialChatMessages);
    setInputValue("");
  };

  return (
    <div className="flex h-[calc(100vh-68px)] overflow-hidden bg-[var(--bg)]">
      {/* ── Main Full-Screen AI Chatbot ──────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chatbot Top Bar */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--text)] text-[var(--bg)] shadow-sm">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
                  BhaAI Chat
                </span>
                <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-mono text-[var(--muted)]">
                  v2.4 Context Engine
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Gmail Gateway status badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
              <Mail size={12} className="text-[var(--accent)]" />
              <span className="font-medium text-[var(--text)] truncate max-w-[160px]">
                {gmailAddress}
              </span>
            </div>

            {/* Clear / Reset Chat */}
            <button
              onClick={handleResetChat}
              title="New Conversation"
              className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-[var(--line)] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition"
            >
              <RotateCcw size={14} />
            </button>

            {/* Toggle Context Panel */}
            <button
              onClick={() => setContextDrawerOpen((v) => !v)}
              title={contextDrawerOpen ? "Hide context drawer" : "Show context drawer"}
              className="flex items-center gap-1.5 rounded-[9px] border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition"
            >
              {contextDrawerOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
              <span className="hidden md:inline">Context</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--text)] text-[var(--bg)] shadow-sm">
                      <Sparkles size={15} />
                    </div>
                  )}

                  <div className={`max-w-[85%] md:max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                    {/* Bubble */}
                    <div
                      className={`rounded-[20px] px-5 py-4 text-sm leading-relaxed shadow-sm ${
                        isUser
                          ? "bg-[var(--text)] text-[var(--bg)] rounded-tr-none font-medium"
                          : "bg-[var(--surface)] text-[var(--text)] border border-[var(--line)] rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Source citations (for Assistant) */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 border-t border-[var(--line)] pt-3">
                          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                            Context referenced:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.sources.map((src, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--text)] border border-[var(--line)]"
                              >
                                {src.type === "gmail" && (
                                  <Mail size={12} className="text-[var(--accent)]" />
                                )}
                                {src.type === "doc" && (
                                  <FileText size={12} className="text-[var(--teal)]" />
                                )}
                                {src.type === "deadline" && (
                                  <Clock3 size={12} className="text-[var(--danger)]" />
                                )}
                                <span>{src.title}</span>
                                {src.detail && (
                                  <span className="text-[10px] text-[var(--muted)]">
                                    · {src.detail}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message Sub-actions */}
                    {!isUser && (
                      <div className="mt-1 flex items-center gap-3 px-2 text-[11px] text-[var(--muted)]">
                        <span>{msg.timestamp || "Just now"}</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 hover:text-[var(--text)] transition"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={12} className="text-[var(--success)]" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white shadow-sm">
                      {session?.user?.name?.[0] || "J"}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thinking / Streaming Indicator */}
            {thinking && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--text)] text-[var(--bg)] animate-pulse">
                  <Sparkles size={15} />
                </div>
                <div className="rounded-[20px] rounded-tl-none border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-xs text-[var(--muted)] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-ping" />
                  <span>Scanning connected Gmail and documents vault…</span>
                </div>
              </div>
            )}

            {/* Starter Prompts (if conversation has only welcome message) */}
            {messages.length === 1 && (
              <div className="pt-2">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Suggested inquiries:
                </div>
                <div className="flex flex-wrap gap-2">
                  {starterPrompts.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleSend(p.query)}
                      className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--text)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] text-left"
                    >
                      {p.label} →
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Docked Bottom Chat Input */}
        <div className="shrink-0 border-t border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="mx-auto max-w-3xl">
            {/* Context status pills */}
            <div className="mb-2 flex items-center justify-between text-[11px] text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-medium text-[var(--teal)]">
                  <Mail size={12} /> Gmail Synced
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium text-[var(--accent)]">
                  <FileText size={12} /> 12 Docs
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium text-[var(--warning)]">
                  <Clock3 size={12} /> 3 Deadlines
                </span>
              </div>
              <span className="hidden sm:inline">Press Enter to send · Shift+Enter for new line</span>
            </div>

            {/* Input Container */}
            <div className="flex items-end gap-2 rounded-[18px] border border-[var(--line)] bg-[var(--bg)] p-2 focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-soft)] transition">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                }}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask BhaAI about your Gmail, deadlines, documents, or tasks…"
                className="max-h-36 min-h-[38px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />

              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || thinking}
                aria-label="Send message"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] transition ${
                  inputValue.trim() && !thinking
                    ? "bg-[var(--text)] text-[var(--bg)] hover:opacity-85 shadow-sm"
                    : "bg-[var(--surface-2)] text-[var(--muted)] cursor-not-allowed"
                }`}
              >
                <ArrowUp size={18} />
              </button>
            </div>

            {/* Privacy footnote */}
            <div className="mt-2 text-center text-[10px] text-[var(--muted)] flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-[var(--teal)]" />
              <span>
                Private & local context. Consequential actions (sending emails, payments) always pause for your confirmation.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Collapsible Right Context Inspector Drawer ──────────────── */}
      {contextDrawerOpen && (
        <aside className="hidden w-[310px] shrink-0 flex-col border-l border-[var(--line)] bg-[var(--surface)] lg:flex overflow-y-auto">
          <div className="flex h-14 items-center justify-between border-b border-[var(--line)] px-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              <ShieldCheck size={14} className="text-[var(--teal)]" />
              <span>Active Context</span>
            </div>
            <button
              onClick={() => setContextDrawerOpen(false)}
              className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
            >
              Close
            </button>
          </div>

          <div className="p-5 space-y-6">
            {/* Gmail Gateway Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <Mail size={14} className="text-[var(--accent)]" /> Gmail Gateway
                </span>
                <span className="rounded-full bg-[var(--success)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--success)]">
                  Connected
                </span>
              </div>
              <div className="rounded-[14px] bg-[var(--surface-2)] p-3 text-xs space-y-1.5">
                <div className="font-medium text-[var(--text)] truncate">{gmailAddress}</div>
                <div className="text-[11px] text-[var(--muted)]">
                  4 threads indexed · OAuth 2.0 active
                </div>
              </div>
            </div>

            {/* Synced Emails List */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
                Detected in Gmail
              </div>
              <div className="space-y-2.5 text-xs">
                {[
                  {
                    sender: "Campus Placement Office",
                    title: "Internship application certificate",
                    tag: "Due 14 Sep",
                    badgeTone: "var(--danger)",
                  },
                  {
                    sender: "SBI Alerts",
                    title: "Electricity bill: ₹1,842",
                    tag: "Due 16 Sep",
                    badgeTone: "var(--warning)",
                  },
                  {
                    sender: "LIC",
                    title: "Policy renewal notice",
                    tag: "Due 03 Oct",
                    badgeTone: "var(--teal)",
                  },
                  {
                    sender: "Amazon India",
                    title: "Order delivered receipt",
                    tag: "Receipt",
                    badgeTone: "var(--muted)",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-[12px] border border-[var(--line)] bg-[var(--bg)] p-2.5 transition hover:border-[var(--accent)] cursor-pointer"
                    onClick={() => handleSend(`Tell me more about ${item.title}`)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--text)] truncate max-w-[150px]">
                        {item.sender}
                      </span>
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                        style={{
                          background: `color-mix(in srgb, ${item.badgeTone} 12%, transparent)`,
                          color: item.badgeTone,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-[var(--muted)] line-clamp-1">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Vault Records */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
                Vault Documents
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { name: "LIC Insurance Policy #49281", type: "Insurance" },
                  { name: "B.Tech Final Semester Marksheet", type: "Academic" },
                  { name: "Apartment Rental Agreement", type: "Contract" },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-[10px] border border-[var(--line)] bg-[var(--bg)] p-2.5 cursor-pointer hover:border-[var(--teal)] transition"
                    onClick={() => handleSend(`What are the details of ${doc.name}?`)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={13} className="text-[var(--teal)] shrink-0" />
                      <span className="truncate font-medium text-[var(--text)]">{doc.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--muted)] shrink-0">{doc.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgent Deadlines */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
                Action Items
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[var(--danger)] font-medium">
                  <AlertCircle size={14} />
                  <span>Internship application: 4 days</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--warning)] font-medium">
                  <Clock3 size={14} />
                  <span>Electricity bill: 6 days</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
