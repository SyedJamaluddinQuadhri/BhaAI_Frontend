import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Bell,
  Sparkles,
  AlertCircle,
  Clock3,
  CreditCard,
  Check,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotificationItem {
  id: string;
  type: "urgent" | "ai" | "info";
  title: string;
  body: string;
  time: string;
  actionText?: string;
  actionPath?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "urgent",
    title: "Internship application: 1 document missing",
    body: "Final college certificate must be uploaded before 14 September.",
    time: "10m ago",
    actionText: "Upload document",
    actionPath: "/documents",
  },
  {
    id: "n2",
    type: "urgent",
    title: "Electricity bill generated: ₹1,842",
    body: "SBI Alerts notice detected in Gmail. Due date is 16 September.",
    time: "1h ago",
    actionText: "View bill",
    actionPath: "/inbox",
  },
  {
    id: "n3",
    type: "ai",
    title: "Open focus window tomorrow at 6 PM",
    body: "BhaAI detected 90 minutes of quiet time. Perfect to finish pending applications.",
    time: "3h ago",
    actionText: "Auto-schedule",
    actionPath: "/calendar",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDrawer({ isOpen, onClose }: Props) {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "urgent" | "ai">("all");
  const navigate = useNavigate();

  const handleDismiss = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const filtered = items.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="relative flex h-full w-full max-w-md flex-col border-l border-[var(--line)] bg-[var(--surface)] shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--line)] px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Bell size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text)]">Activity & Alerts</h3>
                  <div className="text-[11px] text-[var(--muted)]">
                    {items.length} unread updates
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="rounded-[8px] px-2 py-1 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 border-b border-[var(--line)] px-6 py-3 text-xs font-medium bg-[var(--surface-2)]/50">
              {[
                { key: "all", label: "All", count: items.length },
                {
                  key: "urgent",
                  label: "Urgent",
                  count: items.filter((i) => i.type === "urgent").length,
                },
                {
                  key: "ai",
                  label: "AI Insights",
                  count: items.filter((i) => i.type === "ai").length,
                },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as typeof filter)}
                  className={`rounded-full px-3 py-1 transition ${
                    filter === f.key
                      ? "bg-[var(--text)] text-[var(--bg)] font-semibold shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>

            {/* Notifications Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-xs text-[var(--muted)]">
                  <Check size={28} className="mx-auto mb-2 text-[var(--success)] opacity-60" />
                  <div className="font-semibold text-[var(--text)]">All caught up</div>
                  <p className="mt-1 text-[11px]">No alerts requiring your attention right now.</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative rounded-[16px] border border-[var(--line)] bg-[var(--bg)] p-4 transition hover:border-[var(--accent)] hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.type === "urgent" ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--danger)]/15 text-[var(--danger)]">
                            <AlertCircle size={13} />
                          </span>
                        ) : (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                            <Sparkles size={13} />
                          </span>
                        )}
                        <span className="text-[11px] font-semibold text-[var(--muted)]">
                          {item.time}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDismiss(item.id)}
                        title="Dismiss"
                        className="opacity-0 group-hover:opacity-100 text-[var(--muted)] hover:text-[var(--text)] transition"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <h4 className="mt-2 text-sm font-semibold text-[var(--text)]">{item.title}</h4>
                    <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{item.body}</p>

                    {item.actionText && item.actionPath && (
                      <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-2.5">
                        <button
                          onClick={() => {
                            navigate(item.actionPath!);
                            onClose();
                          }}
                          className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:underline"
                        >
                          <span>{item.actionText}</span>
                          <ArrowRight size={12} />
                        </button>
                        <button
                          onClick={() => handleDismiss(item.id)}
                          className="text-[11px] text-[var(--muted)] hover:underline"
                        >
                          Snooze 24h
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
