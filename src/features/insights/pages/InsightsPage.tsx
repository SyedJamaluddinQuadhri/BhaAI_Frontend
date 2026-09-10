import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Sparkles, AlertCircle, Calendar, FileText, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Button } from "../../../components/ui/Button";

interface InsightItem {
  number: string;
  title: string;
  body: string;
  category: string;
  icon: typeof Calendar;
  route: string;
  actionText: string;
}

const insights: InsightItem[] = [
  {
    number: "6",
    title: "deadlines in the next 14 days",
    body: "Your calendar is manageable, but the internship application needs the earliest attention before portal closure.",
    category: "Schedule Velocity",
    icon: Calendar,
    route: "/deadlines",
    actionText: "View 6 Deadlines",
  },
  {
    number: "3",
    title: "documents expire this quarter",
    body: "Two are insurance-related (LIC & Medical). Consider grouping their renewal reminders to avoid duplicate penalties.",
    category: "Policy & Vault",
    icon: FileText,
    route: "/documents",
    actionText: "Review Documents",
  },
  {
    number: "4",
    title: "recurring subscriptions detected",
    body: "One subscription (Cloud Storage ₹499/mo) has not been accessed recently. Review before the next auto-debit charge.",
    category: "Financial Hygiene",
    icon: CreditCard,
    route: "/assistant?q=Audit my recurring subscriptions and show me where I can cut costs",
    actionText: "Audit Subscriptions",
  },
];

export function InsightsPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <Section eyebrow="Life insights" title="Patterns worth noticing.">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="max-w-2xl text-lg muted">
            Not analytics for analytics’ sake. Small pieces of intelligence synthesized from your emails, documents, and calendar that change what you do next.
          </p>

          <Button
            variant="primary"
            onClick={() =>
              navigate(
                "/assistant?q=Give me a comprehensive life audit of all my upcoming obligations, bills, and risk areas"
              )
            }
            className="self-start sm:self-auto text-xs shrink-0"
          >
            <Sparkles size={14} className="mr-1.5" />
            Ask BhaAI Life Audit
          </Button>
        </div>
      </Section>

      <div className="space-y-0 border-b border-[var(--line)]">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              whileHover={{ x: 3 }}
              onClick={() => navigate(item.route)}
              className="group grid gap-6 border-t border-[var(--line)] py-9 md:grid-cols-[140px_1fr_auto] items-center cursor-pointer hover:bg-[var(--surface-2)]/30 px-3 rounded-[20px] transition"
            >
              {/* Big Stat Number */}
              <div className="text-6xl font-semibold tracking-[-.05em] text-[var(--text)] group-hover:text-[var(--accent)] transition">
                {item.number}
              </div>

              {/* Description & Category */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="eyebrow uppercase text-[10px] flex items-center gap-1">
                    <Icon size={12} className="text-[var(--accent)]" />
                    {item.category}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:underline">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-2xl text-sm leading-6 muted">{item.body}</p>
              </div>

              {/* Action Button & Indicator */}
              <div className="flex items-center gap-3 justify-self-start md:justify-self-end">
                <Button
                  variant="secondary"
                  className="text-xs group-hover:border-[var(--text)] transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(item.route);
                  }}
                >
                  {item.actionText}
                </Button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-2)] group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] transition">
                  <ArrowUpRight
                    size={17}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageContainer>
  );
}
