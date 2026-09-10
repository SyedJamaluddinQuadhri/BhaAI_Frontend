import { useState, type FormEvent } from "react";
import { X, Calendar as CalendarIcon, Clock, MapPin, AlignLeft, ShieldCheck } from "lucide-react";
import type { CalendarEventItem, CalendarEventType } from "../types";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

interface Props {
  isOpen: boolean;
  initialDate: Date;
  onClose: () => void;
  onAdd: (event: Omit<CalendarEventItem, "id">) => void;
}

export function AddEventModal({ isOpen, initialDate, onClose, onAdd }: Props) {
  const defaultIso = `${initialDate.getFullYear()}-${String(initialDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(initialDate.getDate()).padStart(2, "0")}`;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultIso);
  const [start, setStart] = useState("10:00");
  const [end, setEnd] = useState("11:00");
  const [type, setType] = useState<CalendarEventType>("event");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<CalendarEventItem["priority"]>("medium");

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      date,
      start: start || "All day",
      end: end || start || "All day",
      type,
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      priority,
      source: "manual",
    });

    setTitle("");
    setDescription("");
    setLocation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2 font-bold text-lg text-[var(--text)]">
            <CalendarIcon size={20} className="text-[var(--accent)]" />
            <span>Schedule New Item</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Title
            </label>
            <Input
              placeholder="e.g. Internship Interview, Electricity Bill, Study Group"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="mt-1"
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Category
            </label>
            <div className="mt-1.5 grid grid-cols-4 gap-2">
              {[
                { key: "event", label: "Event" },
                { key: "deadline", label: "Deadline" },
                { key: "task", label: "Task" },
                { key: "bill", label: "Bill" },
              ].map((t) => (
                <button
                  type="button"
                  key={t.key}
                  onClick={() => setType(t.key as CalendarEventType)}
                  className={`rounded-[10px] py-2 text-xs font-semibold transition border ${
                    type === t.key
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
                <CalendarIcon size={12} /> Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
                <Clock size={12} /> Start Time
              </label>
              <Input
                type="text"
                placeholder="10:00"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
                <Clock size={12} /> End Time
              </label>
              <Input
                type="text"
                placeholder="11:00"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Location & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
                <MapPin size={12} /> Location / Link
              </label>
              <Input
                placeholder="e.g. Google Meet, Library"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
                <ShieldCheck size={12} /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CalendarEventItem["priority"])}
                className="mt-1 w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <AlignLeft size={12} /> Notes / Details
            </label>
            <textarea
              rows={2}
              placeholder="Add relevant instructions, links, or context…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--accent)] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 py-2.5">
              Add to Calendar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
