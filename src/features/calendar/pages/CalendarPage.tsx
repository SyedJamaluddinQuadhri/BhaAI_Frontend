import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Calendar as CalendarIcon,
  List,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock3,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { calendarService } from "../../../services/calendar/calendar.service";
import { authService } from "../../../services/auth/auth.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { CalendarGrid } from "../components/CalendarGrid";
import { CalendarDayInspector } from "../components/CalendarDayInspector";
import { CalendarAgendaView } from "../components/CalendarAgendaView";
import { AddEventModal } from "../components/AddEventModal";
import type { CalendarEventItem, CalendarViewMode, CalendarEventType } from "../types";

export function CalendarPage() {
  const queryClient = useQueryClient();

  // Current viewing month (default: September 2026)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1));
  // Selected date (default: September 10, 2026)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 8, 10));
  // View mode
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  // Type filter
  const [typeFilter, setTypeFilter] = useState<"all" | CalendarEventType>("all");
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date>(new Date(2026, 8, 10));
  // Notification toast
  const [notification, setNotification] = useState<string | null>(null);

  const session = authService.getSession();
  const userEmail = session?.user?.email || "jamal.ahmed@gmail.com";

  // Query events
  const { data: allEvents = [], isFetching, refetch } = useQuery({
    queryKey: ["calendar"],
    queryFn: calendarService.list,
  });

  // Add event mutation
  const addMutation = useMutation({
    mutationFn: calendarService.add,
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      showToast(`Added "${newEvent.title}" to calendar!`);
    },
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: calendarService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      showToast("Item removed from calendar.");
    },
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const jumpToToday = () => {
    const today = new Date(2026, 8, 10);
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  // Filter events
  const filteredEvents =
    typeFilter === "all" ? allEvents : allEvents.filter((e) => e.type === typeFilter);

  // Auto-schedule focus window with BhaAI
  const handleScheduleFocusWindow = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`;

    addMutation.mutate({
      title: "Deep Work: Finalize Internship Docs",
      date: isoDate,
      start: "18:00",
      end: "19:30",
      type: "task",
      location: "Focus Window",
      description: "Auto-scheduled by BhaAI in your 90-min open slot.",
      priority: "high",
      source: "manual",
    });
  };

  const monthYearLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <PageContainer>
      {/* ── Page Header ────────────────────────────────────────── */}
      <div className="pt-10 md:pt-14 pb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-2 flex items-center gap-1.5 text-[var(--accent)]">
              <CalendarDays size={14} /> Time & Schedule Intelligence
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--text)]">
              Time, understood.
            </h1>
            <p className="mt-2 text-base text-[var(--muted)] max-w-2xl">
              A reliable, unified view of your deadlines, calendar events, tasks, and bill payments.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Google Calendar Sync Badge */}
            <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-[var(--text)]">Google Calendar</span>
              <span className="text-[var(--muted)] truncate max-w-[140px]">{userEmail}</span>
              <button
                onClick={() => refetch()}
                title="Sync calendar"
                className="ml-1 text-[var(--muted)] hover:text-[var(--text)] transition"
              >
                <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
              </button>
            </div>

            <button
              onClick={() => {
                setModalDate(selectedDate);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-[12px] bg-[var(--text)] px-4 py-2 text-sm font-semibold text-[var(--bg)] transition hover:opacity-85 shadow-sm"
            >
              <Plus size={16} /> Schedule item
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-4 text-xs font-medium">
          <span className="text-[var(--muted)] mr-1">Filter by:</span>
          {[
            { key: "all", label: "All Items", count: allEvents.length, icon: CalendarDays },
            {
              key: "deadline",
              label: "Deadlines",
              count: allEvents.filter((e) => e.type === "deadline").length,
              icon: AlertCircle,
            },
            {
              key: "event",
              label: "Events",
              count: allEvents.filter((e) => e.type === "event").length,
              icon: CalendarIcon,
            },
            {
              key: "task",
              label: "Tasks",
              count: allEvents.filter((e) => e.type === "task").length,
              icon: CheckCircle2,
            },
            {
              key: "bill",
              label: "Bills",
              count: allEvents.filter((e) => e.type === "bill").length,
              icon: CreditCard,
            },
          ].map((f) => {
            const Icon = f.icon;
            const active = typeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setTypeFilter(f.key as typeof typeFilter)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition border ${
                  active
                    ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)] shadow-sm font-semibold"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <Icon size={12} />
                <span>{f.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    active ? "bg-white/20 text-white" : "bg-[var(--surface-2)] text-[var(--muted)]"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Calendar Controls Bar ───────────────────────────────── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--line)] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--line)] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">{monthYearLabel}</h2>

          <button
            onClick={jumpToToday}
            className="rounded-[8px] border border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--text)] hover:opacity-80 transition"
          >
            Today
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-[10px] bg-[var(--surface-2)] p-1">
          <button
            onClick={() => setViewMode("month")}
            className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === "month"
                ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <CalendarIcon size={14} />
            <span>Month Grid</span>
          </button>
          <button
            onClick={() => setViewMode("agenda")}
            className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold transition ${
              viewMode === "agenda"
                ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            <List size={14} />
            <span>Agenda List</span>
          </button>
        </div>
      </div>

      {/* ── Main View (Month Grid + Day Inspector or Agenda View) ── */}
      {viewMode === "month" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] pb-20">
          {/* Month Calendar Grid */}
          <div className="space-y-4">
            <CalendarGrid
              currentDate={currentDate}
              selectedDate={selectedDate}
              events={filteredEvents}
              onSelectDate={(date) => setSelectedDate(date)}
              onAddEventOnDate={(date) => {
                setModalDate(date);
                setIsModalOpen(true);
              }}
            />

            {/* Calendar Legend / Hints */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)] px-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" /> Event
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--danger)]" /> Deadline
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--teal)]" /> Task
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--warning)]" /> Bill
                </span>
              </div>
              <span className="text-[11px]">Click a day to view details · Double-click to add item</span>
            </div>
          </div>

          {/* Selected Day Timeline & Details */}
          <div className="space-y-6">
            <CalendarDayInspector
              selectedDate={selectedDate}
              events={allEvents}
              onAddEvent={(date) => {
                setModalDate(date);
                setIsModalOpen(true);
              }}
              onDeleteEvent={(id) => deleteMutation.mutate(id)}
              onScheduleFocusWindow={handleScheduleFocusWindow}
            />
          </div>
        </div>
      ) : (
        <div className="pb-20 max-w-4xl">
          <CalendarAgendaView
            events={filteredEvents}
            onDeleteEvent={(id) => deleteMutation.mutate(id)}
            onSelectEventDate={(dateStr) => {
              const [y, m, d] = dateStr.split("-").map(Number);
              setSelectedDate(new Date(y, m - 1, d));
              setCurrentDate(new Date(y, m - 1, 1));
              setViewMode("month");
            }}
          />
        </div>
      )}

      {/* ── Add Event Modal ─────────────────────────────────────── */}
      <AddEventModal
        isOpen={isModalOpen}
        initialDate={modalDate}
        onClose={() => setIsModalOpen(false)}
        onAdd={(newEvent) => addMutation.mutate(newEvent)}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[14px] border border-[var(--line)] bg-[var(--text)] px-4 py-3 text-xs font-semibold text-[var(--bg)] shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles size={15} className="text-[var(--accent)]" />
          <span>{notification}</span>
        </div>
      )}
    </PageContainer>
  );
}
