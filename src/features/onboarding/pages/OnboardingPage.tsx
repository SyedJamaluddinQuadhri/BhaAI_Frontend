import { useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";

const steps = [
  ["Welcome", "A calmer place for everything you don't want to remember."],
  ["What matters?", "Tell BhaAI what you want help staying on top of."],
  ["Connect email", "Bring deadlines, bills and important threads into context."],
  ["Connect calendar", "Let BhaAI understand where your time goes."],
  ["Import documents", "Your important records become searchable and actionable."],
  ["Privacy", "Choose what BhaAI can access. You stay in control."],
  ["Life summary", "Meet BhaAI."],
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
        <div className="max-w-2xl text-center">
          <div className="eyebrow mb-5 flex items-center justify-center gap-1.5 text-[var(--accent)]">
            <Sparkles size={14} /> Meet BhaAI
          </div>
          <h1 className="display">
            I found your life.
            <br />
            Now let’s make it easier.
          </h1>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            <div className="surface p-5 font-medium flex items-center gap-2">
              <Check size={16} className="text-[var(--success)]" /> 12 important emails indexed
            </div>
            <div className="surface p-5 font-medium flex items-center gap-2">
              <Check size={16} className="text-[var(--success)]" /> 7 documents in vault
            </div>
            <div className="surface p-5 font-medium flex items-center gap-2">
              <Check size={16} className="text-[var(--success)]" /> 4 upcoming deadlines
            </div>
            <div className="surface p-5 font-medium flex items-center gap-2">
              <Check size={16} className="text-[var(--success)]" /> 3 recurring payments detected
            </div>
          </div>
          <Button className="mt-9 py-3 px-8 text-base shadow-sm" onClick={() => navigate("/assistant")}>
            Launch BhaAI Workspace <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    );
  }

  const [title, body] = steps[step];

  return (
    <div className="min-h-screen p-6 bg-[var(--bg)]">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="font-bold tracking-tight text-lg">BhaAI</div>
          <div className="text-xs font-mono muted">
            {step + 1} / {steps.length}
          </div>
        </div>

        <div className="max-w-3xl py-20">
          <div className="eyebrow mb-5">
            {step === 0 ? "Personal AI life operating system" : "Setup step"}
          </div>
          <h1 className="display">{title}</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 muted">{body}</p>
          {step === 5 && (
            <div className="mt-8 flex items-center gap-3 text-sm text-[var(--teal)] font-medium">
              <ShieldCheck className="text-[var(--teal)]" size={18} />
              Your permissions are always explicit and can be revoked anytime.
            </div>
          )}
        </div>

        <div className="flex justify-between border-t border-[var(--line)] pt-6">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          <Button
            onClick={() => (step === steps.length - 1 ? setDone(true) : setStep((s) => s + 1))}
          >
            {step === steps.length - 1 ? "See my summary" : "Continue"} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
