import { useState } from "react";
import { CheckCircle2, Circle, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskItem {
  id: string;
  title: string;
  when: string;
  done: boolean;
}

const initialTasks: TaskItem[] = [
  { id: "t1", title: "Submit internship application", when: "Today", done: false },
  { id: "t2", title: "Pay electricity bill (₹1,842)", when: "Today", done: false },
  { id: "t3", title: "Complete project report draft", when: "Today", done: true },
];

export function TodaySection() {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [undoItem, setUndoItem] = useState<{ id: string; title: string } | null>(null);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextDone = !t.done;
          if (nextDone) {
            // Trigger undo option
            setUndoItem({ id: t.id, title: t.title });
            setTimeout(() => {
              setUndoItem((curr) => (curr?.id === id ? null : curr));
            }, 5000);
          }
          return { ...t, done: nextDone };
        }
        return t;
      })
    );
  };

  const handleUndo = () => {
    if (!undoItem) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === undoItem.id ? { ...t, done: false } : t))
    );
    setUndoItem(null);
  };

  const allCompleted = tasks.every((t) => t.done);

  return (
    <div className="space-y-3 relative">
      <div className="space-y-0">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            onClick={() => toggleTask(task.id)}
            className="group flex items-center gap-4 border-b border-[var(--line)] py-4 cursor-pointer hover:bg-[var(--surface-2)]/40 px-2 rounded-[12px] transition"
          >
            {/* Interactive Checkbox with Spring Pop */}
            <motion.div
              whileTap={{ scale: 0.8 }}
              className="shrink-0 flex items-center justify-center"
            >
              {task.done ? (
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

            {/* Title with Smooth Strike-Through */}
            <div
              className={`flex-1 text-base font-medium transition-all duration-200 ${
                task.done ? "line-through text-[var(--muted)] opacity-60" : "text-[var(--text)]"
              }`}
            >
              {task.title}
            </div>

            <span className="text-xs muted font-mono">{task.when}</span>

            <ChevronRight
              size={16}
              className="translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 muted"
            />
          </motion.div>
        ))}
      </div>

      {/* All Done Celebration Badge */}
      {allCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[16px] border border-[var(--success)]/30 bg-[var(--success)]/10 p-4 text-center text-xs font-semibold text-[var(--success)] flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          <span>All tasks cleared for today! You're completely caught up.</span>
        </motion.div>
      )}

      {/* Floating Undo Toast (5-second window) */}
      <AnimatePresence>
        {undoItem && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--text)] px-4 py-2.5 text-xs font-medium text-[var(--bg)] shadow-2xl"
          >
            <span>Completed "{undoItem.title}"</span>
            <button
              onClick={handleUndo}
              className="flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-1 text-xs font-bold text-white hover:opacity-90 transition"
            >
              <RotateCcw size={12} /> Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
