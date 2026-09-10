import { useQuery } from "@tanstack/react-query";
import { Bell, Sparkles, AlertCircle, Info } from "lucide-react";
import { notificationsService } from "../../../services/notifications/notifications.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Badge } from "../../../components/ui/Badge";

const typeIcon = {
  urgent: AlertCircle,
  ai: Sparkles,
  info: Info,
} as const;

export function NotificationsPage() {
  const { data = [] } = useQuery({ queryKey: ["notifications"], queryFn: notificationsService.list });

  return (
    <PageContainer>
      <Section eyebrow="Notifications" title="The things worth interrupting you for.">
        <p className="max-w-2xl text-lg muted">
          Filtered by importance — BhaAI surfaces only what genuinely needs your attention.
        </p>
      </Section>
      <div>
        {data.map((n) => {
          const Icon = typeIcon[(n.type as keyof typeof typeIcon)] ?? Bell;
          return (
            <div key={n.id} className="flex gap-5 border-b border-[var(--line)] py-6">
              <div className="mt-0.5 shrink-0">
                <Icon size={18} className="muted" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{n.title}</h3>
                  <Badge tone={n.type === "urgent" ? "danger" : n.type === "ai" ? "accent" : "neutral"}>
                    {n.type}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 muted">{n.body}</p>
                <div className="mt-2 text-[11px] muted">{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
