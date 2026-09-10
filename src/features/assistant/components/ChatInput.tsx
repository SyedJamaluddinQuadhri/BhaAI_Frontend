import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { IconButton } from "../../../components/ui/IconButton";
export function ChatInput({ onSend }: { onSend:(text:string)=>void }) {
  const [value,setValue]=useState("");
  const send=()=>{if(value.trim()){onSend(value.trim());setValue("");}};
  return <div className="border-t border-[var(--line)] p-4"><div className="flex items-end gap-2 rounded-[15px] border border-[var(--line)] bg-[var(--surface)] p-2"><textarea value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} rows={1} placeholder="Ask BhaAI…" className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-[var(--muted)]"/><IconButton aria-label="Send" onClick={send} className="bg-[var(--text)] text-[var(--bg)] hover:opacity-80"><ArrowUp size={17}/></IconButton></div><div className="mt-2 text-center text-[10px] muted">BhaAI uses your connected information. Consequential actions always ask for approval.</div></div>;
}
