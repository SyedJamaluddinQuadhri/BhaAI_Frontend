import { Sparkles, X, Minus } from "lucide-react";
import { IconButton } from "../../../components/ui/IconButton";
export function ChatHeader({ onClose, onMinimize }: { onClose:()=>void; onMinimize:()=>void }) {
  return <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--text)] text-[var(--bg)]"><Sparkles size={17}/></div><div><div className="text-sm font-semibold">BhaAI</div><div className="text-[11px] text-[var(--teal)]">Context ready</div></div></div><div className="flex"><IconButton aria-label="Minimize" onClick={onMinimize}><Minus size={17}/></IconButton><IconButton aria-label="Close" onClick={onClose}><X size={17}/></IconButton></div></div>;
}
