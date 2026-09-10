import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Mail,
  Clock3,
  CheckSquare,
  CalendarDays,
  Users,
  Search,
  ArrowUpRight,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Button } from "../../../components/ui/Button";

interface KnowledgeNode {
  icon: typeof FileText;
  title: string;
  type: string;
  route: string;
  detail: string;
  connectedTo: string[];
}

const nodes: KnowledgeNode[] = [
  {
    icon: FileText,
    title: "LIC Insurance Policy",
    type: "document",
    route: "/documents/d1",
    detail: "Primary life insurance policy document uploaded via document scanner.",
    connectedTo: ["LIC renewal email", "03 Oct 2026 deadline", "Renew insurance task"],
  },
  {
    icon: Mail,
    title: "LIC renewal email",
    type: "email",
    route: "/inbox",
    detail: "Verified sender premium notice received from alerts@licindia.com.",
    connectedTo: ["LIC Insurance Policy", "Renewal reminder"],
  },
  {
    icon: Clock3,
    title: "03 Oct 2026",
    type: "deadline",
    route: "/deadlines",
    detail: "Hard policy expiration milestone before grace period applies.",
    connectedTo: ["Renew insurance task", "Renewal reminder"],
  },
  {
    icon: CheckSquare,
    title: "Renew insurance",
    type: "task",
    route: "/tasks",
    detail: "High-priority action item to pay premium via online portal.",
    connectedTo: ["03 Oct 2026", "Insurance provider"],
  },
  {
    icon: CalendarDays,
    title: "Renewal reminder",
    type: "calendar",
    route: "/calendar",
    detail: "Calendar event scheduled 3 days prior with 9:00 AM push notification.",
    connectedTo: ["03 Oct 2026", "LIC renewal email"],
  },
  {
    icon: Users,
    title: "Insurance provider",
    type: "entity",
    route: "/assistant?q=What are my contact and account details for LIC insurance provider?",
    detail: "Indexed contact entity with claims helpline and policy officer.",
    connectedTo: ["LIC Insurance Policy"],
  },
];

export function KnowledgePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  const filtered = nodes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.type.toLowerCase().includes(search.toLowerCase()) ||
      n.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <Section eyebrow="Knowledge" title="A living map of your life.">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="max-w-2xl text-lg muted">
            Connections, not a developer graph. Follow the thread from raw information to automated action.
          </p>

          <div className="relative w-full sm:w-64">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter graph nodes..."
              className="w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface-2)] pl-9 pr-3 py-2 text-xs text-[var(--text)] outline-none"
            />
          </div>
        </div>
      </Section>

      {/* Living Knowledge Node Grid */}
      <div className="grid gap-px overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedNode(item)}
              className="bg-[var(--surface)] p-7 cursor-pointer hover:bg-[var(--surface-2)]/60 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--surface-2)] text-[var(--accent)] group-hover:bg-[var(--text)] group-hover:text-[var(--bg)] transition">
                    <Icon size={20} />
                  </div>
                  <ArrowUpRight
                    size={17}
                    className="opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                  />
                </div>

                <div className="eyebrow mt-6 uppercase tracking-wider text-[11px]">
                  {item.type}
                </div>
                <h3 className="mt-1.5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 muted">{item.detail}</p>
              </div>

              <div>
                <div className="mt-6 h-px w-full bg-[var(--line)]" />
                <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[var(--accent)] group-hover:underline">
                  <span>Connected context</span>
                  <span>→</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Context Thread Inspector Modal */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-lg rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <GitBranch size={18} className="text-[var(--accent)]" />
                  <span className="text-xs font-semibold uppercase tracking-wider muted">
                    Knowledge Graph Thread
                  </span>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-xs muted hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--surface-2)] text-[var(--accent)]">
                    <selectedNode.icon size={22} />
                  </div>
                  <div>
                    <span className="eyebrow uppercase text-[10px]">{selectedNode.type}</span>
                    <h3 className="text-xl font-bold">{selectedNode.title}</h3>
                    <p className="mt-1 text-xs leading-5 muted">{selectedNode.detail}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[16px] bg-[var(--surface-2)] p-4">
                  <div className="text-xs font-semibold mb-2 text-[var(--text)] flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[var(--accent)]" />
                    How BhaAI connected this item:
                  </div>
                  <div className="space-y-1.5 text-xs muted">
                    {selectedNode.connectedTo.map((target) => (
                      <div key={target} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        <span>Connected to: <strong className="text-[var(--text)]">{target}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--line)]">
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={() => {
                    navigate(`/assistant?q=Tell me everything connected to ${encodeURIComponent(selectedNode.title)}`);
                  }}
                >
                  <Sparkles size={13} className="mr-1.5 text-[var(--accent)]" />
                  Ask BhaAI
                </Button>

                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setSelectedNode(null)}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate(selectedNode.route);
                    }}
                  >
                    Open Source Item →
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
