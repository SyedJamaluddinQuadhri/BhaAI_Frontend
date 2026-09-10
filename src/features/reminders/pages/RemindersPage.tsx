import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Bell, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Button } from "../../../components/ui/Button";
import { ReminderList } from "../components/ReminderList";
import { reminderService, type ReminderItem } from "../../../services/reminders/reminder.service";

export function RemindersPage() {
  const queryClient = useQueryClient();
  const { data: reminders = [], refetch } = useQuery({
    queryKey: ["reminders"],
    queryFn: reminderService.list,
  });

  const [filter, setFilter] = useState<"all" | "scheduled" | "completed">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newWhen, setNewWhen] = useState("");
  const [newChannel, setNewChannel] = useState("Push + Calendar");

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await reminderService.create({
      title: newTitle.trim(),
      when: newWhen.trim() || "Tomorrow · 9:00 AM",
      channel: newChannel,
      source: "Manual",
    });
    setNewTitle("");
    setNewWhen("");
    setIsAddOpen(false);
    queryClient.invalidateQueries({ queryKey: ["reminders"] });
  };

  const filtered = reminders.filter((r) => {
    if (filter === "all") return true;
    if (filter === "completed") return r.status === "completed";
    return r.status !== "completed";
  });

  return (
    <PageContainer>
      <Section eyebrow="Planned nudges" title="Reminders, not deadlines.">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="max-w-2xl text-lg muted">
            A deadline is fixed. A reminder is how BhaAI helps you get there without having to remember.
          </p>

          <Button
            variant="primary"
            onClick={() => setIsAddOpen(true)}
            className="self-start sm:self-auto text-xs"
          >
            <Plus size={15} className="mr-1.5" />
            New reminder
          </Button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-[var(--line)] pb-4 text-xs font-semibold">
          {[
            { key: "all", label: "All Nudges", count: reminders.length },
            {
              key: "scheduled",
              label: "Upcoming",
              count: reminders.filter((r) => r.status !== "completed").length,
            },
            {
              key: "completed",
              label: "Completed",
              count: reminders.filter((r) => r.status === "completed").length,
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
                    layoutId="activeReminderTab"
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

      <ReminderList reminders={filtered} onRefresh={() => queryClient.invalidateQueries({ queryKey: ["reminders"] })} />

      {/* Add Reminder Modal */}
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
                  <Bell size={18} className="text-[var(--accent)]" />
                  <h3 className="font-semibold text-base">Schedule New Reminder</h3>
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
                  <label className="text-xs font-semibold muted">What to remember</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Call dentist, Renew passport, Submit expense receipt"
                    autoFocus
                    className="mt-1.5 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold muted">When to remind you</label>
                  <input
                    type="text"
                    value={newWhen}
                    onChange={(e) => setNewWhen(e.target.value)}
                    placeholder="e.g. Tomorrow · 9:00 AM or 18 Oct · 4:00 PM"
                    className="mt-1.5 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] outline-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["Tomorrow 9:00 AM", "This Evening 7:00 PM", "In 3 Days"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNewWhen(preset)}
                        className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[11px] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--line)] transition"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold muted">Channel</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2 text-xs">
                    {["Push", "Push + Calendar", "Push + Email"].map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setNewChannel(ch)}
                        className={`rounded-[10px] border p-2 text-center font-medium transition ${
                          newChannel === ch
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

              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-[var(--line)]">
                <Button variant="secondary" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreate}>
                  Create Reminder
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
