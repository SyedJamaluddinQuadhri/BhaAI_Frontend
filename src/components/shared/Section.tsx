import type { ReactNode } from "react";
export function Section({ eyebrow, title, children, className = "" }: { eyebrow?: string; title?: string; children: ReactNode; className?: string }) {
  return <section className={`py-12 md:py-20 ${className}`}>
    {(eyebrow || title) && <div className="mb-8 md:mb-10">{eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}{title && <h2 className="section-title max-w-3xl">{title}</h2>}</div>}
    {children}
  </section>;
}
