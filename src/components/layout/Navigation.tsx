import { NavLink } from "react-router-dom";
import { Home, Sparkles, Inbox, Clock3, CheckSquare, CalendarDays, FileText, Network, Bell, Shield, Plug, Settings, AlarmClock } from "lucide-react";
import { BhaAIIcon } from "../shared/BhaAIIcon";

const primary = [
  ["/", "Home", Home], ["/assistant", "BhaAI", Sparkles], ["/inbox", "Inbox", Inbox],
  ["/deadlines", "Deadlines", Clock3], ["/tasks", "Tasks", CheckSquare], ["/calendar", "Calendar", CalendarDays],
  ["/documents", "Documents", FileText], ["/knowledge", "Knowledge", Network], ["/insights", "Insights", Sparkles], ["/reminders", "Reminders", AlarmClock],
] as const;

const utility = [
  ["/notifications", "Notifications", Bell], ["/integrations", "Integrations", Plug],
  ["/privacy", "Privacy", Shield], ["/settings", "Settings", Settings],
] as const;

export function Navigation() {
  return <aside className="hidden w-[230px] shrink-0 border-r border-[var(--line)] px-5 py-7 lg:block">
    <div className="mb-9 flex items-center gap-3 px-2">
      <BhaAIIcon size={36} />
      <div>
        <div className="font-bold tracking-tight text-[var(--text)]">BhaAI</div>
        <div className="text-[10px] muted">Your life, understood.</div>
      </div>
    </div>
    <nav className="space-y-1">{primary.map(([to, label, Icon]) => <NavLink key={to} to={to} className={({isActive}) => `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition ${isActive ? "bg-[var(--surface-2)] font-semibold" : "muted hover:bg-[var(--surface-2)] hover:text-[var(--text)]"}`}><Icon size={17} strokeWidth={1.8}/>{label}</NavLink>)}</nav>
    <div className="my-7 h-px bg-[var(--line)]" />
    <div className="eyebrow px-3 pb-2">System</div>
    <nav className="space-y-1">{utility.map(([to, label, Icon]) => <NavLink key={to} to={to} className={({isActive}) => `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition ${isActive ? "bg-[var(--surface-2)] font-semibold" : "muted hover:bg-[var(--surface-2)] hover:text-[var(--text)]"}`}><Icon size={17} strokeWidth={1.8}/>{label}</NavLink>)}</nav>
    <div className="mt-12 px-3 text-xs leading-5 muted">Private by design.<br/>Your information stays yours.</div>
  </aside>;
}
