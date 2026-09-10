import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Sparkles,
  Mail,
  FileText,
  Clock3,
  CalendarDays,
  CheckSquare,
  ArrowRight,
  Command,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BhaAIIcon } from "../shared/BhaAIIcon";

interface CommandItem {
  id: string;
  category: "Gmail" | "Documents" | "Deadlines" | "Actions" | "AI";
  title: string;
  subtitle: string;
  icon: typeof Sparkles;
  path?: string;
  action?: () => void;
  badge?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const allItems: CommandItem[] = [
    {
      id: "ai-query",
      category: "AI",
      title: query ? `Ask BhaAI: "${query}"` : "Ask BhaAI anything…",
      subtitle: "Conversational query on your connected life memory",
      icon: Sparkles,
      action: () => {
        navigate("/assistant");
        onClose();
      },
      badge: "AI Action",
    },
    {
      id: "gmail-placement",
      category: "Gmail",
      title: "Campus Placement Office — Internship certificate",
      subtitle: "Final certificate upload due 14 September",
      icon: Mail,
      path: "/inbox",
      badge: "Due 14 Sep",
    },
    {
      id: "gmail-bill",
      category: "Gmail",
      title: "Electricity bill: ₹1,842 (SBI Alerts)",
      subtitle: "Payment due 16 September 2026",
      icon: Mail,
      path: "/inbox",
      badge: "Bill ₹1,842",
    },
    {
      id: "doc-lic",
      category: "Documents",
      title: "LIC Insurance Policy #49281",
      subtitle: "Vault record · Policy renewal on 03 Oct 2026",
      icon: FileText,
      path: "/documents",
      badge: "Insurance",
    },
    {
      id: "doc-degree",
      category: "Documents",
      title: "B.Tech Final Semester Marksheet",
      subtitle: "Verified university grade transcript",
      icon: FileText,
      path: "/documents",
      badge: "Academic",
    },
    {
      id: "deadline-intern",
      category: "Deadlines",
      title: "Internship Application Submission",
      subtitle: "Online portal submission deadline · 4 days left",
      icon: Clock3,
      path: "/deadlines",
      badge: "Urgent",
    },
    {
      id: "calendar-sync",
      category: "Actions",
      title: "Open Calendar & Schedule Focus Slot",
      subtitle: "90-minute free window tomorrow at 6 PM",
      icon: CalendarDays,
      path: "/calendar",
      badge: "Schedule",
    },
    {
      id: "tasks-view",
      category: "Actions",
      title: "Review Today's Pending Tasks",
      subtitle: "3 tasks requiring your attention today",
      icon: CheckSquare,
      path: "/tasks",
      badge: "Tasks",
    },
  ];

  // Filter items based on query
  const filtered = allItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filtered[selectedIndex];
      if (selected) {
        if (selected.action) selected.action();
        else if (selected.path) {
          navigate(selected.path);
          onClose();
        }
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
              <BhaAIIcon size={26} variant="gradient" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search emails, documents, deadlines, or ask BhaAI…"
                className="flex-1 bg-transparent text-base font-medium text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
              <span className="flex items-center gap-1 rounded-md bg-[var(--surface-2)] px-2 py-1 text-[11px] font-mono text-[var(--muted)]">
                ESC to close
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-[var(--line)]">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted)]">
                  No matching context found. Press Enter to ask BhaAI directly.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.action) item.action();
                        else if (item.path) {
                          navigate(item.path);
                          onClose();
                        }
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`group flex items-center justify-between gap-3 rounded-[14px] p-3 transition cursor-pointer ${
                        isSelected
                          ? "bg-[var(--accent)] text-white shadow-sm"
                          : "hover:bg-[var(--surface-2)] text-[var(--text)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-[var(--surface-2)] text-[var(--text)]"
                          }`}
                        >
                          <Icon size={17} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs sm:text-sm truncate">
                            {item.title}
                          </div>
                          <div
                            className={`text-[11px] truncate ${
                              isSelected ? "text-white/80" : "text-[var(--muted)]"
                            }`}
                          >
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-[var(--surface-2)] text-[var(--muted)]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight
                          size={14}
                          className={`transition ${
                            isSelected ? "opacity-100 translate-x-0.5" : "opacity-0"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--surface-2)]/60 px-5 py-2.5 text-[11px] text-[var(--muted)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="rounded bg-[var(--surface)] px-1 py-0.5 font-mono text-[10px] border border-[var(--line)]">
                    ↑↓
                  </span>{" "}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="rounded bg-[var(--surface)] px-1 py-0.5 font-mono text-[10px] border border-[var(--line)]">
                    ↵
                  </span>{" "}
                  Select
                </span>
              </div>
              <span>Powered by BhaAI Spotlight</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
