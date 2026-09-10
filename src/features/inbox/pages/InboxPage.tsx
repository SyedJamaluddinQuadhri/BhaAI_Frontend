import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  ArrowUpRight,
  RefreshCw,
  Clock3,
  CreditCard,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { emailService } from "../../../services/email/email.service";
import { authService } from "../../../services/auth/auth.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Badge } from "../../../components/ui/Badge";

const categoryIcons: Record<string, typeof Clock3> = {
  Deadline: Clock3,
  Bill: CreditCard,
  Insurance: ShieldCheck,
  Receipt: FileCheck,
};

export function InboxPage() {
  const { data = [], refetch, isFetching } = useQuery({
    queryKey: ["emails"],
    queryFn: emailService.list,
  });

  const session = authService.getSession();
  const gmailAddress = session?.user?.gmailAddress || "jamal.ahmed@gmail.com";

  return (
    <PageContainer>
      {/* Header section */}
      <Section eyebrow="Inbox intelligence" title="Your inbox, understood.">
        {/* Gmail Gateway Status Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <Mail size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Gmail Gateway Synced</span>
                <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
              </div>
              <div className="text-xs muted">{gmailAddress} · OAuth 2.0 Read-only</div>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:opacity-80 transition"
          >
            <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Syncing…" : "Sync Gmail"}
          </button>
        </div>

        {/* Metric summaries */}
        <div className="grid gap-5 border-y border-[var(--line)] py-7 sm:grid-cols-3">
          <div>
            <div className="text-3xl font-semibold">3</div>
            <div className="text-sm muted">deadlines detected</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">2</div>
            <div className="text-sm muted">bills detected</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">4</div>
            <div className="text-sm muted">actions detected</div>
          </div>
        </div>
      </Section>

      {/* Email Feed */}
      <div>
        {data.map((e) => {
          const CategoryIcon = categoryIcons[e.category] ?? Mail;
          return (
            <div
              key={e.id}
              className="group grid gap-4 border-b border-[var(--line)] py-6 md:grid-cols-[1fr_170px_auto]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <Mail size={17} className="muted" />
                  <span className="font-semibold">{e.sender}</span>
                  <Badge tone={e.category === "Deadline" ? "danger" : "neutral"}>
                    <span className="flex items-center gap-1">
                      <CategoryIcon size={12} />
                      {e.category}
                    </span>
                  </Badge>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{e.subject}</h3>
                <p className="mt-1 text-sm leading-6 muted">{e.summary}</p>
                {e.action && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                    <span>Action:</span>
                    <span className="text-[var(--text)]">{e.action}</span>
                  </div>
                )}
              </div>
              <div className="text-xs muted md:text-right">{e.date}</div>
              <ArrowUpRight size={17} className="opacity-30 group-hover:opacity-100 transition" />
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
