import { FileText } from "lucide-react";
import { Badge } from "../ui/Badge";
import type { SourceReference as Source } from "../../types/common";

export function SourceReference({ source }: { source: Source }) {
  return <div className="flex items-center gap-3 rounded-[14px] bg-[var(--surface-2)] p-3">
    <FileText size={16} />
    <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{source.label}</div><div className="truncate text-[11px] muted">{source.detail}</div></div>
    {source.confidence !== undefined && <Badge tone="success">{source.confidence}%</Badge>}
  </div>;
}
