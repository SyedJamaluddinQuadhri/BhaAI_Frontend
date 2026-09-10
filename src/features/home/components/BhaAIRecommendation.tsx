import { Sparkles, CalendarPlus } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export function BhaAIRecommendation() {
  return (
    <div className="grid gap-7 rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-7 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
        <Sparkles size={20} />
      </div>
      <div>
        <div className="eyebrow mb-2">BhaAI says</div>
        <p className="max-w-2xl text-lg leading-7">
          You have a free{" "}
          <strong>90-minute window</strong> tomorrow at 6 PM. That's a good slot
          to finish the internship application before the deadline.
        </p>
      </div>
      <Button variant="secondary">
        <CalendarPlus size={15} />
        Schedule
      </Button>
    </div>
  );
}
