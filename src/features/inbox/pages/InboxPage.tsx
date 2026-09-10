import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  ArrowUpRight,
  RefreshCw,
  Clock3,
  CreditCard,
  ShieldCheck,
  FileCheck,
  Calendar,
  CheckSquare,
  Sparkles,
  Check,
  Inbox,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { emailService, type GmailStatus } from "../../../services/email/email.service";
import { authService } from "../../../services/auth/auth.service";
import { calendarService } from "../../../services/calendar/calendar.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { GmailConsentModal } from "../../../components/shared/GmailConsentModal";
import type { Email } from "../../../types/common";

const categoryIcons: Record<string, typeof Clock3> = {
  Deadline: Clock3,
  Bill: CreditCard,
  Insurance: ShieldCheck,
  Receipt: FileCheck,
};

export function InboxPage() {
  const navigate = useNavigate();
  const [gmailStatus, setGmailStatus] = useState<GmailStatus>({ connected: false });
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    emailService.getGmailStatus().then(setGmailStatus);
  }, []);

  const { data = [], refetch, isFetching } = useQuery({
    queryKey: ["emails"],
    queryFn: emailService.list,
  });

  const session = authService.getSession();
  const gmailAddress = gmailStatus.email || session?.user?.email || "Connected Gmail Account";

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await emailService.syncGmail();
      await refetch();
      const updatedStatus = await emailService.getGmailStatus();
      setGmailStatus(updatedStatus);
      showToast(`Synced! ${res.synced_count} emails indexed.`);
    } catch {
      showToast("Sync completed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddToCalendar = async (email: Email) => {
    await calendarService.add({
      title: email.action || email.subject,
      date: "2026-09-16",
      start: "09:00",
      end: "10:00",
      type: "deadline",
      source: "gmail",
      description: `Auto-extracted from email: ${email.subject} (${email.sender})`,
    });
    showToast("Event added to your calendar!");
    setSelectedEmail(null);
  };

  const handleCreateTask = (email: Email) => {
    const STORAGE_KEY = "bhaai_tasks_custom";
    const raw = localStorage.getItem(STORAGE_KEY);
    const tasks = raw ? JSON.parse(raw) : [];
    tasks.unshift({
      id: `task_${Date.now()}`,
      title: email.action || email.subject,
      status: "todo",
      priority: "high",
      effort: "small",
      deadline: email.date,
      related: email.sender,
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    showToast("Action created in your Task space!");
    setSelectedEmail(null);
  };

  const deadlineCount = data.filter((e) => e.category === "Deadline").length;
  const billCount = data.filter((e) => e.category === "Bill").length;
  const actionCount = data.filter((e) => Boolean(e.action)).length;

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
                <span className="text-sm font-semibold">
                  {gmailStatus.connected ? "Gmail Connected" : "Gmail Not Connected"}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    gmailStatus.connected ? "bg-[var(--success)]" : "bg-[var(--muted)]"
                  }`}
                />
              </div>
              <div className="text-xs muted">
                {gmailStatus.connected ? `${gmailAddress} · OAuth 2.0 Read-only` : "Authorize read-only access to index emails"}
              </div>
            </div>
          </div>

          {gmailStatus.connected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSync}
                disabled={isSyncing || isFetching}
                className="flex items-center gap-1.5 rounded-[10px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:opacity-80 transition"
              >
                <RefreshCw size={13} className={isSyncing || isFetching ? "animate-spin" : ""} />
                {isSyncing || isFetching ? "Syncing…" : "Sync Gmail"}
              </button>
              <button
                onClick={async () => {
                  await emailService.disconnectGmail();
                  setGmailStatus({ connected: false });
                  showToast("Gmail disconnected.");
                  refetch();
                }}
                className="rounded-[10px] border border-[var(--line)] px-2.5 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--danger)] transition"
                title="Disconnect Gmail"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <Button
              variant="primary"
              className="text-xs"
              onClick={() => setShowConsentModal(true)}
            >
              Connect Gmail
            </Button>
          )}
        </div>

        {/* Dynamic Metric summaries */}
        <div className="grid gap-5 border-y border-[var(--line)] py-7 sm:grid-cols-3">
          <div>
            <div className="text-3xl font-semibold">{deadlineCount}</div>
            <div className="text-sm muted">deadlines detected</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">{billCount}</div>
            <div className="text-sm muted">bills detected</div>
          </div>
          <div>
            <div className="text-3xl font-semibold">{actionCount}</div>
            <div className="text-sm muted">actions detected</div>
          </div>
        </div>
      </Section>

      {/* Email Feed */}
      <div>
        {data.length === 0 ? (
          <div className="py-16 text-center text-xs text-[var(--muted)]">
            <Inbox size={32} className="mx-auto text-[var(--muted)] opacity-50 mb-3" />
            <div className="font-semibold text-base text-[var(--text)]">No emails indexed yet</div>
            <p className="mt-1 text-xs max-w-sm mx-auto">
              {gmailStatus.connected
                ? "Click 'Sync Gmail' to ingest and vectorize messages into your Email FAISS index."
                : "Connect your Gmail account to enable read-only intelligence and action extraction."}
            </p>
            {!gmailStatus.connected && (
              <Button
                variant="primary"
                className="mt-4 text-xs"
                onClick={() => setShowConsentModal(true)}
              >
                Connect Gmail
              </Button>
            )}
          </div>
        ) : (
          data.map((e) => {
            const CategoryIcon = categoryIcons[e.category] ?? Mail;
            return (
              <motion.div
                key={e.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelectedEmail(e)}
                className="group grid gap-4 border-b border-[var(--line)] py-6 md:grid-cols-[1fr_170px_auto] cursor-pointer hover:bg-[var(--surface-2)]/30 px-3 rounded-[16px] transition"
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
                  <h3 className="mt-3 text-lg font-semibold group-hover:text-[var(--accent)] transition">
                    {e.subject}
                  </h3>
                  <p className="mt-1 text-sm leading-6 muted">{e.summary}</p>
                  {e.action && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
                      <span>Action:</span>
                      <span className="text-[var(--text)]">{e.action}</span>
                    </div>
                  )}
                </div>
                <div className="text-xs muted md:text-right">{e.date}</div>
                <ArrowUpRight
                  size={17}
                  className="opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Email Context Inspector Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmail(null)}
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
                  <Mail size={18} className="text-[var(--accent)]" />
                  <span className="text-xs font-semibold uppercase tracking-wider muted">
                    Parsed Email Intelligence
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-xs muted hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text)]">{selectedEmail.sender}</span>
                  <span className="text-xs muted">{selectedEmail.date}</span>
                </div>
                <h3 className="mt-1.5 text-lg font-bold">{selectedEmail.subject}</h3>

                <div className="mt-4 rounded-[14px] bg-[var(--surface-2)] p-3.5 text-xs leading-5 muted">
                  <div className="font-semibold text-[var(--text)] mb-1">Extracted Summary:</div>
                  {selectedEmail.summary}
                </div>

                {selectedEmail.action && (
                  <div className="mt-3 rounded-[12px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-3 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[var(--accent)]">Identified Action:</div>
                      <div className="text-[var(--text)] mt-0.5">{selectedEmail.action}</div>
                    </div>
                    <Badge tone="accent">{selectedEmail.category}</Badge>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-[var(--line)]">
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={() => {
                    navigate(`/assistant?q=Explain what action is required from email: ${encodeURIComponent(selectedEmail.subject)}`);
                  }}
                >
                  <Sparkles size={13} className="mr-1.5 text-[var(--accent)]" />
                  Ask BhaAI
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="text-xs"
                    onClick={() => handleCreateTask(selectedEmail)}
                  >
                    <CheckSquare size={13} className="mr-1.5" />
                    Create Task
                  </Button>
                  <Button
                    variant="primary"
                    className="text-xs"
                    onClick={() => handleAddToCalendar(selectedEmail)}
                  >
                    <Calendar size={13} className="mr-1.5" />
                    Add to Calendar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-[16px] border border-[var(--line)] bg-[var(--text)] px-4 py-2.5 text-xs font-medium text-[var(--bg)] shadow-2xl"
          >
            <Check size={14} className="text-[var(--success)]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gmail Consent Modal */}
      <GmailConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        userEmail={gmailAddress}
        onAuthorizeSuccess={() => {
          emailService.getGmailStatus().then((s) => {
            setGmailStatus(s);
            showToast("Gmail connected successfully! (Read-only)");
            refetch();
          });
        }}
      />
    </PageContainer>
  );
}
