interface BhaAIIconProps {
  size?: number;
  className?: string;
  variant?: "gradient" | "solid" | "glass";
}

export function BhaAIIcon({ size = 32, className = "", variant = "gradient" }: BhaAIIconProps) {
  const getBackground = () => {
    switch (variant) {
      case "solid":
        return "bg-[var(--text)] text-[var(--bg)]";
      case "glass":
        return "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)]";
      case "gradient":
      default:
        return "bg-gradient-to-br from-[#4d5fd7] via-[#3a4bc0] to-[#177c72] text-white shadow-sm";
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-[28%] overflow-hidden ${getBackground()} ${className}`}
    >
      {/* Ambient background glow */}
      {variant === "gradient" && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/10 pointer-events-none" />
      )}

      {/* Bespoke BhaAI Emblem: Interlinked Neural Companion + AI Spark */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${size * 0.64}px`, height: `${size * 0.64}px` }}
        className="relative z-10 drop-shadow-sm"
      >
        {/* Outer orbital life ring */}
        <circle
          cx="20"
          cy="20"
          r="15.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeDasharray="4 2"
          strokeOpacity="0.45"
        />

        {/* Central Intelligence Core */}
        <circle cx="20" cy="20" r="5" fill="currentColor" fillOpacity="0.9" />

        {/* Connected Context Nodes (Email, Docs, Calendar) */}
        <circle cx="10" cy="14" r="2.2" fill="currentColor" />
        <circle cx="30" cy="14" r="2.2" fill="currentColor" />
        <circle cx="20" cy="31" r="2.2" fill="currentColor" />

        {/* Neural Synapse lines connecting to core */}
        <path
          d="M10 14L20 20M30 14L20 20M20 31L20 20"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />

        {/* Four-point AI Brilliance Spark at center-top */}
        <path
          d="M20 8.5C20.3 11 21.5 12.2 24 12.5C21.5 12.8 20.3 14 20 16.5C19.7 14 18.5 12.8 16 12.5C18.5 12.2 19.7 11 20 8.5Z"
          fill="#FFF"
        />
      </svg>
    </div>
  );
}
