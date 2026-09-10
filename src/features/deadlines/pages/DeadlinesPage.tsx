import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clock3,
  CheckCircle2,
  Circle,
  Plus,
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deadlinesService } from "../../../services/deadlines/deadlines.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import type { Deadline, Priority } from "../../../types/common";

export function DeadlinesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data = [] } = useQuery({
    queryKey: ["deadlines"],
    queryFn: deadlinesService.list,
  });

  const [filter, setFilter] = useState<"all" | "urgent" | "high" | "medium" | "done">("all");
  const [undoItem, setUndoItem] = useState<{ id: string; title: string } | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("high");

  const handleToggleStatus = async (id: string, title: string, currentStatus: string) => {
    await deadlinesService.toggleStatus(id);
    queryClient.invalidateQueries({ queryKey: ["deadlines"] });

    if (currentStatus !== "done") {
      setUndoItem({ id, title });
      setTimeout(() => {
        setUndoItem((prev) => (prev?.id === id ? null : prev));
      }, 5000);
    }
  };

  const handleUndo = async () => {
    if (!undoItem) return;
    await deadlinesService.toggleStatus(undoItem.id);
    queryClient.invalidateQueries({ queryKey: ["deadlines"] });
    setUndoItem(null);
  };

  const handleCreateDeadline = async () => {
    if (!newTitle.trim() || !newDate.trim()) return;
    await deadlinesService.add({
      title: newTitle.trim(),
      date: newDate.trim(),
      action: newAction.trim() || "Complete task",
      source: newSource.trim() || "Manual entry",
      priority: newPriority,
      status: "todo",
    });

    setNewTitle("");
    setNewDate("");
    setNewAction("");
    setNewSource("");
    setIsAddOpen(false);
    queryClient.invalidateQueries({ queryKey: ["deadlines"] });
  };

  const handleNavigateSource = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes("email") || s.includes("mail")) {
      navigate("/inbox");
    } else if (s.includes("policy") || s.includes("receipt") || s.includes("doc")) {
      navigate("/documents");
    } else {
      navigate(`/assistant?q=Find information related to ${encodeURIComponent(source)}`);
    }
  };

  const filtered = data.filter((d) => {
    if (filter === "all") return true;
    if (filter === "done") return d.status === "done";
    if (d.status === "done") return false;
    return d.priority === filter;
  });

  return (
    <PageContainer>
      <Section eyebrow="Deadline center" title="What needs your attention.">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="max-w-2xl text-lg leading-8 muted">
            Fixed points in time, connected with the source files and actionable reminders that help you reach them.
          </p>

          <Button
            variant="primary"
            onClick={() => setIsAddOpen(true)}
            className="self-start sm:self-auto text-xs shrink-0"
          >
            <Plus size={15} className="mr-1.5" />
            Add deadline
          </Button>
        </div>

        {/* Priority Filter Navigation */}
        <div className="mt-8 flex items-center gap-2 border-b border-[var(--line)] pb-4 text-xs font-semibold overflow-x-auto">
          {[
            { key: "all", label: "All Deadlines", count: data.length },
            {
              key: "urgent",
              label: "Urgent",
              count: data.filter((d) => d.priority === "urgent" && d.status !== "done").length,
            },
            {
              key: "high",
              label: "High",
              count: data.filter((d) => d.priority === "high" && d.status !== "done").length,
            },
            {
              key: "medium",
              label: "Medium",
              count: data.filter((d) => d.priority === "medium" && d.status !== "done").length,
            },
            {
              key: "done",
              label: "Resolved",
              count: data.filter((d) => d.status === "done").length,
            },
          ].map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`relative px-3.5 py-1.5 rounded-full transition shrink-0 ${
                  active ? "text-[var(--text)] font-bold" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeDeadlineTab"
                    className="absolute inset-0 rounded-full bg-[var(--surface-2)] shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <span>{tab.label}</span>{" "}
                <span className="text-[11px] opacity-60">({tab.count})</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Deadlines Timeline List */}
      <div className="relative border-l border-[var(--line)] ml-2 pb-16">
        {filtered.length === 0 ? (
          <div className="py-16 pl-8 text-xs text-[var(--muted)]">
            <Sparkles size={22} className="text-[var(--accent)] mb-2 opacity-70" />
            <div className="font-semibold text-sm text-[var(--text)]">No deadlines matching this filter</div>
            <p className="mt-1">All obligations in this category are fulfilled.</p>
          </div>
        ) : (
          filtered.map((d) => {
            const isDone = d.status === "done";
            return (
              <motion.div
                key={d.id}
                layout
                className="relative grid gap-3 border-b border-[var(--line)] pb-8 pl-8 pt-4 md:grid-cols-[140px_1fr_auto] md:gap-6 hover:bg-[var(--surface-2)]/30 rounded-r-[16px] transition group"
              >
                {/* Timeline Dot Indicator */}
                <span
                  className={`absolute -left-[5.5px] top-5 h-2.5 w-2.5 rounded-full ring-4 ring-[var(--bg)] transition ${
                    isDone
                      ? "bg-[var(--success)]"
                      : d.priority === "urgent"
                      ? "bg-[var(--danger)]"
                      : "bg-[var(--text)]"
                  }`}
                />

                {/* Date */}
                <div className="eyebrow flex items-center gap-1.5 text-xs">
                  <Clock3 size={13} className="text-[var(--muted)]" />
                  <span className={isDone ? "line-through opacity-60" : "font-semibold"}>{d.date}</span>
                </div>

                {/* Title & Action */}
                <div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleStatus(d.id, d.title, d.status)}
                      className="shrink-0 text-[var(--muted)] hover:text-[var(--accent)] transition"
                      title={isDone ? "Mark todo" : "Mark resolved"}
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} className="text-[var(--success)]" />
                      ) : (
                        <Circle size={18} />
                      )}
                    </button>
                    <h3
                      className={`text-xl font-semibold transition ${
                        isDone ? "line-through text-[var(--muted)] opacity-60" : "text-[var(--text)]"
                      }`}
                    >
                      {d.title}
                    </h3>
                  </div>

                  <div className="mt-1.5 pl-7 flex flex-wrap items-center gap-2 text-xs muted">
                    <span className="font-medium text-[var(--text)]">{d.action}</span>
                    <span>·</span>
                    <button
                      onClick={() => handleNavigateSource(d.source)}
                      className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline"
                    >
                      <span>{d.source}</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>

                {/* Badges & Actions */}
                <div className="flex items-center gap-2 pl-7 md:pl-0">
                  <Badge
                    tone={
                      d.priority === "urgent"
                        ? "danger"
                        : d.priority === "high"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {d.priority}
                  </Badge>
                  <StatusBadge status={d.status} />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Floating Undo Toast */}
      <AnimatePresence>
        {undoItem && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--text)] px-4 py-2.5 text-xs font-medium text-[var(--bg)] shadow-2xl"
          >
            <span>Deadline resolved: "{undoItem.title}"</span>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-bold text-white hover:opacity-90 transition"
            >
              <RotateCcw size={12} /> Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Deadline Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <Clock3 size={18} className="text-[var(--accent)]" />
                  <h3 className="font-semibold text-base">Add New Deadline</h3>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="text-xs muted hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold muted">Deadline Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Passport renewal, Tax return filing"
                    autoFocus
                    className="mt-1.5 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold muted">Due Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. 15 Oct 2026 or 24 Sep"
                    className="mt-1.5 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold muted">Action Required</label>
                  <input
                    type="text"
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    placeholder="e.g. Submit form online, Pay balance"
                    className="mt-1.5 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold muted">Priority</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2 text-xs">
                    {(["urgent", "high", "medium"] as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`rounded-[10px] border p-2 text-center font-semibold capitalize transition ${
                          newPriority === p
                            ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                            : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-[var(--line)]">
                <Button variant="secondary" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreateDeadline}>
                  Save Deadline
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
