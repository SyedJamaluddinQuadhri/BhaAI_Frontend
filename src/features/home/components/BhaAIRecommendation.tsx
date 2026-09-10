import { useState } from "react";
import { Sparkles, CalendarPlus, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { calendarService } from "../../../services/calendar/calendar.service";

export function BhaAIRecommendation() {
  const [scheduled, setScheduled] = useState(false);
  const navigate = useNavigate();

  const handleSchedule = async () => {
    await calendarService.add({
      title: "Focus Window: Internship Application",
      date: "2026-09-11",
      start: "18:00",
      end: "19:30",
      type: "task",
      location: "Focus Mode",
      description: "Auto-scheduled 90-min slot by BhaAI recommendation.",
      priority: "high",
      source: "manual",
    });
    setScheduled(true);
  };

  return (
    <div className="grid gap-7 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-7 md:grid-cols-[auto_1fr_auto] md:items-center shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        <Sparkles size={20} />
      </div>
      <div>
        <div className="eyebrow mb-2">BhaAI says</div>
        <p className="max-w-2xl text-lg leading-7">
          You have a free <strong>90-minute window</strong> tomorrow at 6 PM. That's a good slot
          to finish the internship application before the deadline.
        </p>
      </div>

      {scheduled ? (
        <Button
          variant="secondary"
          onClick={() => navigate("/calendar")}
          className="border border-[var(--success)]/40 bg-[var(--success)]/10 text-[var(--success)] font-semibold"
        >
          <Check size={16} /> Scheduled · View <ArrowRight size={14} />
        </Button>
      ) : (
        <Button variant="secondary" onClick={handleSchedule} className="shadow-sm">
          <CalendarPlus size={15} />
          Schedule
        </Button>
      )}
    </div>
  );
}
