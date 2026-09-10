import { Sun, Moon, Bell, Command } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { useTheme } from "../../hooks/useTheme";
import { BhaAIIcon } from "../shared/BhaAIIcon";

interface TopbarProps {
  onAssistant?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenNotifications?: () => void;
}

export function Topbar({
  onAssistant,
  onOpenCommandPalette,
  onOpenNotifications,
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  const handleSearchClick = () => {
    if (onOpenCommandPalette) onOpenCommandPalette();
    else if (onAssistant) onAssistant();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--bg)]/90 backdrop-blur-md">
      <div className="container-bh flex h-[68px] items-center justify-between gap-4">
        {/* Spotlight Command Palette Trigger */}
        <button
          onClick={handleSearchClick}
          aria-label="Open Command Palette"
          className="focus-ring flex min-w-0 flex-1 max-w-[500px] items-center gap-3 rounded-[14px] border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-left text-sm muted hover:border-[var(--accent)] hover:bg-[var(--surface-2)] transition group shadow-sm"
        >
          <BhaAIIcon size={22} variant="gradient" />
          <span className="truncate text-xs font-medium group-hover:text-[var(--text)]">
            Search emails, docs, deadlines, or ask BhaAI…
          </span>
          <span className="ml-auto hidden items-center gap-1 rounded-md bg-[var(--surface-2)] px-2 py-0.5 text-[10px] font-mono md:flex border border-[var(--line)]">
            <Command size={10} />K
          </span>
        </button>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Theme Switcher with Smooth Rotation */}
          <IconButton aria-label="Toggle theme" onClick={toggleTheme}>
            <span className="transition-transform duration-300 hover:rotate-45 inline-block">
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </span>
          </IconButton>

          {/* Activity / Notification Bell with Badge */}
          <div className="relative">
            <IconButton aria-label="Notifications" onClick={onOpenNotifications}>
              <Bell size={18} />
            </IconButton>
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--danger)] text-[9px] font-bold text-white shadow-sm ring-2 ring-[var(--surface)] pointer-events-none">
              3
            </span>
          </div>

          {/* User Profile Avatar */}
          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--text)] to-[var(--muted)] text-xs font-bold text-[var(--bg)] shadow-sm">
            J
          </div>
        </div>
      </div>
    </header>
  );
}
