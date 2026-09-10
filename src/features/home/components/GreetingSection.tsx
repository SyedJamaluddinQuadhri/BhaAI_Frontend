import { CalendarDays, AlertCircle } from "lucide-react";

export function GreetingSection() {
  return (
    <div className="pt-14 md:pt-20">
      <div className="mb-5 flex items-center gap-2">
        <CalendarDays size={14} className="muted" />
        <div className="eyebrow">Thursday · 10 September 2026</div>
      </div>
      <h1 className="display max-w-4xl">Good morning, Jamal.</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 muted">
        You have{" "}
        <strong className="inline-flex items-center gap-1 text-[var(--text)]">
          <AlertCircle size={16} className="text-[var(--danger)]" />
          3 things
        </strong>{" "}
        that need your attention today. Let's make the important stuff easy.
      </p>
    </div>
  );
}
