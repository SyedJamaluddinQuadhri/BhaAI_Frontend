import { Check, LoaderCircle } from "lucide-react";
export function WorkflowStatus({ active = false }: { active?: boolean }) {
  const steps=["Searching emails","Finding relevant documents","Checking deadlines","Preparing action plan"];
  return <div className="rounded-[18px] bg-[var(--surface-2)] p-4"><div className="eyebrow mb-3">Safe workflow status</div>{steps.map((s,i)=><div key={s} className="flex items-center gap-3 py-2 text-xs">{i<2 || !active?<Check size={15} className="text-[var(--success)]"/>:<LoaderCircle size={15} className="animate-spin text-[var(--accent)]"/>}<span>{s}</span></div>)}</div>;
}
