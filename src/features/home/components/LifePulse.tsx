import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface StatItem {
  icon: typeof AlertTriangle;
  targetNumber: number;
  label: string;
  color: string;
  route: string;
}

const stats: StatItem[] = [
  { icon: AlertTriangle, targetNumber: 3, label: "urgent deadlines", color: "var(--danger)", route: "/deadlines" },
  { icon: Clock, targetNumber: 5, label: "upcoming items", color: "var(--warning)", route: "/calendar" },
  { icon: AlertCircle, targetNumber: 1, label: "overdue action", color: "var(--muted)", route: "/tasks" },
];

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const stepTime = 120;
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, stepTime);
    return () => clearInterval(interval);
  }, [target]);

  return <span>{count}</span>;
}

export function LifePulse() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 border-y border-[var(--line)] py-8 sm:grid-cols-3">
      {stats.map(({ icon: Icon, targetNumber, label, color, route }) => (
        <motion.div
          key={label}
          whileHover={{ y: -3, transition: { duration: 0.15 } }}
          onClick={() => navigate(route)}
          className="flex items-center gap-4 rounded-[16px] p-3 transition hover:bg-[var(--surface-2)]/50 cursor-pointer group"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] shadow-sm group-hover:scale-105 transition"
            style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
          >
            <Icon size={22} />
          </div>
          <div>
            <div className="text-4xl font-bold tracking-tight text-[var(--text)] font-mono">
              <AnimatedCounter target={targetNumber} />
            </div>
            <div className="mt-0.5 text-xs text-[var(--muted)] capitalize group-hover:text-[var(--text)] transition">
              {label} →
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
