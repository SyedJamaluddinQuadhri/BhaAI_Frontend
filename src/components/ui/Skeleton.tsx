export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[10px] bg-[var(--surface-2)] ${className}`} />;
}
