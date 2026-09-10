import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, MessageSquare } from "lucide-react";
import { useLocation } from "react-router-dom";
import { BhaAIChat } from "./BhaAIChat";
import { BhaAIIcon } from "../../../components/shared/BhaAIIcon";

export function FloatingBhaAI({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Hide the floating chatbot on the dedicated full-page assistant workspace
  if (location.pathname === "/assistant") {
    return null;
  }

  return (
    <>
      {/* Floating Chatbot Window */}
      <AnimatePresence>
        {open && (
          <div className="fixed bottom-6 right-6 z-50">
            <BhaAIChat onClose={() => onOpenChange(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      {!open && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
        >
          {/* Main Floating Chatbot Icon Button */}
          <button
            type="button"
            aria-label="Open BhaAI Assistant"
            onClick={() => onOpenChange(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex h-14 items-center rounded-full bg-[var(--text)] p-1 text-[var(--bg)] shadow-[0_10px_35px_rgba(77,95,215,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_45px_rgba(77,95,215,0.5)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/30"
          >
            {/* Soft Ambient Glow Ping */}
            <span className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--teal)] opacity-40 blur-md transition group-hover:opacity-75" />

            {/* BhaAI Custom Emblem */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full overflow-hidden">
              <BhaAIIcon size={48} variant="gradient" />
            </div>

            {/* Hover Expansion Text Pill */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap pr-4 pl-1"
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold tracking-tight text-[var(--bg)]">
                    <Sparkles size={13} className="text-[var(--accent)]" />
                    Ask BhaAI
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live Context Indicator Dot */}
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center">
              <span className="absolute h-3 w-3 rounded-full bg-[var(--success)] opacity-75 animate-ping" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--success)] ring-2 ring-[var(--surface)]" />
            </span>
          </button>
        </motion.div>
      )}
    </>
  );
}
