import { NavLink } from "react-router-dom";
import { Home, Clock3, FileText, CheckSquare } from "lucide-react";
import { BhaAIIcon } from "../shared/BhaAIIcon";

export function MobileNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-[var(--line)] bg-[var(--surface)]/95 px-2 py-2 backdrop-blur lg:hidden">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-1 flex-col items-center gap-1 py-1 text-[10px] ${
            isActive ? "font-bold text-[var(--text)]" : "muted"
          }`
        }
      >
        <Home size={18} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/deadlines"
        className={({ isActive }) =>
          `flex flex-1 flex-col items-center gap-1 py-1 text-[10px] ${
            isActive ? "font-bold text-[var(--text)]" : "muted"
          }`
        }
      >
        <Clock3 size={18} />
        <span>Deadlines</span>
      </NavLink>

      {/* Center prominent BhaAI action button */}
      <NavLink
        to="/assistant"
        className="flex flex-col items-center -mt-4 py-1"
        aria-label="BhaAI Assistant"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full shadow-md transition hover:scale-105">
          <BhaAIIcon size={42} />
        </div>
        <span className="text-[10px] font-bold text-[var(--text)] mt-0.5">BhaAI</span>
      </NavLink>

      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          `flex flex-1 flex-col items-center gap-1 py-1 text-[10px] ${
            isActive ? "font-bold text-[var(--text)]" : "muted"
          }`
        }
      >
        <CheckSquare size={18} />
        <span>Tasks</span>
      </NavLink>

      <NavLink
        to="/documents"
        className={({ isActive }) =>
          `flex flex-1 flex-col items-center gap-1 py-1 text-[10px] ${
            isActive ? "font-bold text-[var(--text)]" : "muted"
          }`
        }
      >
        <FileText size={18} />
        <span>Docs</span>
      </NavLink>
    </nav>
  );
}
