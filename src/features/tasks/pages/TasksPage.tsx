import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Plus,
  Clock3,
  Sparkles,
  RotateCcw,
  Zap,
} from "lucide-react";
import { tasksService } from "../../../services/tasks/tasks.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import type { Task, Status } from "../../../types/common";

export function TasksPage() {
  const { data: initialData = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksService.list,
  });

  const [taskList, setTaskList] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [undoTask, setUndoTask] = useState<{ id: string; title: string } | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Sync initial data into local state
  const tasks = taskList.length > 0 ? taskList : initialData;

  const toggleTask = (id: string) => {
    const current = tasks.length > 0 ? tasks : initialData;
    const updated = current.map((t) => {
      if (t.id === id) {
        const nextStatus: Status = t.status === "done" ? "todo" : "done";
        if (nextStatus === "done") {
          setUndoTask({ id: t.id, title: t.title });
          setTimeout(() => {
            setUndoTask((curr) => (curr?.id === id ? null : curr));
          }, 5000);
        }
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTaskList(updated);
  };

  const handleUndo = () => {
    if (!undoTask) return;
    setTaskList((prev) =>
      prev.map((t) => (t.id === undoTask.id ? { ...t, status: "todo" as Status } : t))
    );
    setUndoTask(null);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      status: "todo",
      priority: "medium",
      effort: "small",
      deadline: "Today",
    };
    setTaskList([newTask, ...tasks]);
    setNewTaskTitle("");
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "done") return t.status === "done";
    return t.status !== "done";
  });

  return (
    <PageContainer>
      <Section eyebrow="Action space" title="Things I need to do.">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="max-w-2xl text-lg muted">
            A calm place for actions created from your life context, emails, and deadlines.
          </p>

          <button
            onClick={() => setIsAdding((v) => !v)}
            className="flex items-center gap-2 self-start sm:self-auto rounded-[12px] bg-[var(--text)] px-4 py-2 text-xs font-semibold text-[var(--bg)] hover:opacity-85 shadow-sm transition"
          >
            <Plus size={15} /> Add action
          </button>
        </div>

        {/* Filter Navigation Tabs with Sliding Highlight */}
        <div className="mt-8 flex items-center gap-2 border-b border-[var(--line)] pb-4 text-xs font-semibold">
          {[
            { key: "all", label: "All Actions", count: tasks.length },
            {
              key: "todo",
              label: "Pending",
              count: tasks.filter((t) => t.status !== "done").length,
            },
            {
              key: "done",
              label: "Completed",
              count: tasks.filter((t) => t.status === "done").length,
            },
          ].map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`relative px-3.5 py-1.5 rounded-full transition ${
                  active ? "text-[var(--text)] font-bold" : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeTaskTab"
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

      {/* Quick Add Inline Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="flex items-center gap-2 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-sm">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                placeholder="What do you need to get done?"
                autoFocus
                className="flex-1 bg-transparent px-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
              />
              <button
                onClick={handleAddTask}
                className="rounded-[10px] bg-[var(--text)] px-3 py-1.5 text-xs font-semibold text-[var(--bg)]"
              >
                Save
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="rounded-[10px] px-2 py-1 text-xs text-[var(--muted)] hover:text-[var(--text)]"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="divide-y divide-[var(--line)] pb-20">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center text-xs text-[var(--muted)]">
            <Sparkles size={24} className="mx-auto text-[var(--accent)] mb-2 opacity-60" />
            <div className="font-semibold text-[var(--text)]">No actions in this category</div>
            <p className="mt-0.5 text-[11px]">You're on top of everything here.</p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isDone = t.status === "done";
            return (
              <motion.div
                key={t.id}
                layout
                onClick={() => toggleTask(t.id)}
                className="group grid gap-3 py-5 md:grid-cols-[auto_1fr_150px_110px_auto] md:items-center cursor-pointer hover:bg-[var(--surface-2)]/40 px-3 rounded-[14px] transition"
              >
                {/* Interactive Checkbox */}
                <motion.div whileTap={{ scale: 0.8 }} className="shrink-0">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <CheckCircle2 size={20} className="text-[var(--success)]" />
                    </motion.div>
                  ) : (
                    <Circle size={20} className="muted group-hover:text-[var(--accent)] transition" />
                  )}
                </motion.div>

                {/* Task Title & Details */}
                <div>
                  <h3
                    className={`text-base font-semibold transition ${
                      isDone ? "line-through text-[var(--muted)] opacity-60" : "text-[var(--text)]"
                    }`}
                  >
                    {t.title}
                  </h3>
                  <p className="mt-0.5 text-xs muted flex items-center gap-2">
                    <span>{t.related ?? "Personal"}</span>
                    <span>·</span>
                    <span className="capitalize flex items-center gap-1">
                      <Zap size={11} className="text-[var(--warning)]" />
                      {t.effort} effort
                    </span>
                  </p>
                </div>

                {/* Deadline */}
                <div className="text-xs muted flex items-center gap-1.5">
                  <Clock3 size={13} />
                  <span>{t.deadline ?? "No deadline"}</span>
                </div>

                {/* Priority */}
                <div className="text-xs capitalize font-medium text-[var(--muted)]">
                  {t.priority} priority
                </div>

                {/* Status Badge */}
                <div className="justify-self-start md:justify-self-end">
                  <StatusBadge status={t.status} />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Floating Undo Toast */}
      <AnimatePresence>
        {undoTask && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--text)] px-4 py-2.5 text-xs font-medium text-[var(--bg)] shadow-2xl"
          >
            <span>Action completed: "{undoTask.title}"</span>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-bold text-white hover:opacity-90 transition"
            >
              <RotateCcw size={12} /> Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
