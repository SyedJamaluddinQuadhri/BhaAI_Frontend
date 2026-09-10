import { NavLink } from "react-router-dom";
import { Home, Bot, Clock3, FileText, CheckSquare } from "lucide-react";
const items = [["/","Home",Home],["/assistant","BhaAI",Bot],["/deadlines","Deadlines",Clock3],["/tasks","Tasks",CheckSquare],["/documents","Docs",FileText]] as const;
export function MobileNavigation() { return <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--line)] bg-[var(--surface)]/95 px-2 py-2 backdrop-blur lg:hidden">{items.map(([to,label,Icon])=><NavLink key={to} to={to} className={({isActive})=>`flex flex-1 flex-col items-center gap-1 py-1 text-[10px] ${isActive?"font-bold":"muted"}`}><Icon size={18}/>{label}</NavLink>)}</nav>; }
