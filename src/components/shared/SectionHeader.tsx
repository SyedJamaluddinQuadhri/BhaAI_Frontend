import type React from 'react';
export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return <div className="mb-7 flex items-end justify-between gap-4">{<div>{eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}<h2 className="section-title">{title}</h2></div>}{action}</div>;
}
