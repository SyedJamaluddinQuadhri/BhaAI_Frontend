import { Search, Sun, Moon, Bell, Command } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { useTheme } from "../../hooks/useTheme";

export function Topbar({ onAssistant }: { onAssistant: () => void }) {
  const { theme, toggleTheme } = useTheme();
  return <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--bg)]/90 backdrop-blur-md">
    <div className="container-bh flex h-[68px] items-center justify-between gap-4">
      <button onClick={onAssistant} className="focus-ring flex min-w-0 flex-1 max-w-[480px] items-center gap-3 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2.5 text-left text-sm muted"><Search size={17}/><span className="truncate">Ask BhaAI anything about your life…</span><span className="ml-auto hidden items-center gap-1 rounded-md bg-[var(--surface-2)] px-2 py-1 text-[10px] md:flex"><Command size={11}/>K</span></button>
      <div className="flex items-center gap-1"><IconButton aria-label="Toggle theme" onClick={toggleTheme}>{theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}</IconButton><IconButton aria-label="Notifications"><Bell size={18}/></IconButton><div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text)] text-xs font-bold text-[var(--bg)]">J</div></div>
    </div>
  </header>;
}
