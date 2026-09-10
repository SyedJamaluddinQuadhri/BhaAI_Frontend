import { useState } from "react";
import {
  Bell,
  Clock3,
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  Calendar,
  Send,
  Edit2,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../components/ui/Button";
import { reminderService, type ReminderItem } from "../../../services/reminders/reminder.service";

interface ReminderListProps {
  reminders: ReminderItem[];
  onRefresh: () => void;
}

export function ReminderList({ reminders, onRefresh }: ReminderListProps) {
  const [editingItem, setEditingItem] = useState<ReminderItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editWhen, setEditWhen] = useState("");
  const [editChannel, setEditChannel] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleStartEdit = (r: ReminderItem) => {
    setEditingItem(r);
    setEditTitle(r.title);
    setEditWhen(r.when);
    setEditChannel(r.channel);
    setOpenMenuId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !editTitle.trim()) return;
    await reminderService.update(editingItem.id, {
      title: editTitle.trim(),
      when: editWhen.trim(),
      channel: editChannel.trim(),
    });
    setEditingItem(null);
    onRefresh();
  };

  const handleToggleComplete = async (id: string) => {
    await reminderService.toggleComplete(id);
    onRefresh();
  };

  const handleSnooze = async (id: string) => {
    await reminderService.snooze(id);
    setOpenMenuId(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await reminderService.delete(id);
    if (editingItem?.id === id) setEditingItem(null);
    setOpenMenuId(null);
    onRefresh();
  };

  if (reminders.length === 0) {
    return (
      <div className="py-16 text-center text-xs text-[var(--muted)]">
        <Bell size={24} className="mx-auto text-[var(--accent)] mb-2 opacity-60" />
        <div className="font-semibold text-[var(--text)]">No reminders found</div>
        <p className="mt-1">Add a new nudge or check completed reminders.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-[var(--line)]">
        {reminders.map((r) => {
          const isDone = r.status === "completed";
          return (
            <motion.div
              key={r.id}
              layout
              className="flex items-center gap-4 py-5 hover:bg-[var(--surface-2)]/30 px-3 rounded-[16px] transition group"
            >
              {/* Interactive toggle */}
              <button
                onClick={() => handleToggleComplete(r.id)}
                className="shrink-0 p-1 hover:opacity-80 transition"
                title={isDone ? "Mark active" : "Mark completed"}
              >
                {isDone ? (
                  <CheckCircle2 size={20} className="text-[var(--success)]" />
                ) : (
                  <Circle size={20} className="muted group-hover:text-[var(--accent)] transition" />
                )}
              </button>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text)]">
                <Bell size={17} className={r.status === "snoozed" ? "text-[var(--warning)]" : ""} />
              </div>

              {/* Title & Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold text-sm truncate ${
                      isDone ? "line-through text-[var(--muted)] opacity-60" : "text-[var(--text)]"
                    }`}
                  >
                    {r.title}
                  </span>
                  {r.status === "snoozed" && (
                    <span className="rounded-full bg-[var(--warning-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--warning)]">
                      Snoozed
                    </span>
                  )}
                  {r.source && (
                    <span className="hidden sm:inline-block text-[11px] muted opacity-60">
                      via {r.source}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />
                    {r.when}
                  </span>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Send size={11} />
                    {r.channel}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  className="text-xs h-8 px-2.5"
                  onClick={() => handleStartEdit(r)}
                >
                  <Edit2 size={13} className="mr-1" />
                  Edit
                </Button>

                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)] transition"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenuId === r.id && (
                    <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-1 shadow-lg text-xs">
                      <button
                        onClick={() => handleSnooze(r.id)}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[var(--text)] hover:bg-[var(--surface-2)] transition"
                      >
                        <RotateCcw size={12} />
                        Snooze (+24h)
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[var(--danger)] hover:bg-[var(--danger-soft)] transition"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Reminder Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <h3 className="font-semibold text-base">Edit Reminder</h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-xs muted hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold muted">Reminder Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold muted">Schedule / Time</label>
                  <input
                    type="text"
                    value={editWhen}
                    onChange={(e) => setEditWhen(e.target.value)}
                    placeholder="e.g. 30 Sep · 9:00 AM"
                    className="mt-1.5 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["Tomorrow 9:00 AM", "Friday 6:00 PM", "Next Monday 9:00 AM"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEditWhen(preset)}
                        className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--line)] transition"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold muted">Delivery Channel</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2 text-xs">
                    {["Push", "Push + Calendar", "Push + Email"].map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setEditChannel(ch)}
                        className={`rounded-[10px] border p-2 text-center font-medium transition ${
                          editChannel === ch
                            ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                            : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)]"
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--line)]">
                <Button
                  variant="danger"
                  className="text-xs"
                  onClick={() => handleDelete(editingItem.id)}
                >
                  <Trash2 size={13} className="mr-1" />
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
