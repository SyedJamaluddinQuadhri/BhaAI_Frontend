import { Badge } from "../ui/Badge";
export function StatusBadge({ status }: { status: string }) {
  const tone = status === "overdue" ? "danger" : status === "done" ? "success" : status === "in-progress" ? "accent" : "neutral";
  return <Badge tone={tone}>{status.replace("-", " ")}</Badge>;
}
