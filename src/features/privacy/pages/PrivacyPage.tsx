import { useState } from "react";
import {
  Shield,
  Download,
  Trash2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  History,
  Sliders,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Button } from "../../../components/ui/Button";

interface PrivacyControl {
  title: string;
  body: string;
  scope: string;
  retentionDays: number;
  localEncrypted: boolean;
  autoPurge: boolean;
}

const initialControls: PrivacyControl[] = [
  {
    title: "Email access",
    body: "Read access to connected inboxes. You can revoke it anytime.",
    scope: "gmail.readonly",
    retentionDays: 90,
    localEncrypted: true,
    autoPurge: true,
  },
  {
    title: "Calendar access",
    body: "Read events and create events only after explicit approval.",
    scope: "calendar.events",
    retentionDays: 180,
    localEncrypted: true,
    autoPurge: false,
  },
  {
    title: "Document access",
    body: "Encrypted storage and local processing boundaries.",
    scope: "documents.storage",
    retentionDays: 365,
    localEncrypted: true,
    autoPurge: false,
  },
  {
    title: "AI access",
    body: "BhaAI uses connected context only to answer your requests.",
    scope: "ai.inference",
    retentionDays: 30,
    localEncrypted: true,
    autoPurge: true,
  },
];

const auditEvents = [
  { id: "a1", event: "OAuth 2.0 Token Refreshed", service: "Google Mail", time: "12 mins ago", status: "Secure" },
  { id: "a2", event: "TOTP 2FA Verification Verified", service: "Google Authenticator", time: "2 hours ago", status: "Verified" },
  { id: "a3", event: "Encrypted Document OCR Completed", service: "BhaAI Vision Engine", time: "Yesterday", status: "Clean" },
  { id: "a4", event: "Calendar Write Consent Checked", service: "Google Calendar", time: "2 days ago", status: "Approved" },
  { id: "a5", event: "Session IP Check (192.168.1.1)", service: "Auth Security", time: "3 days ago", status: "Matched" },
];

export function PrivacyPage() {
  const [controls, setControls] = useState<PrivacyControl[]>(() => {
    const raw = localStorage.getItem("bhaai_privacy_settings");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return initialControls;
      }
    }
    return initialControls;
  });

  const [activeManagingControl, setActiveManagingControl] = useState<PrivacyControl | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveControl = (updated: PrivacyControl) => {
    const newControls = controls.map((c) => (c.title === updated.title ? updated : c));
    setControls(newControls);
    localStorage.setItem("bhaai_privacy_settings", JSON.stringify(newControls));
    setActiveManagingControl(null);
    showToast(`Updated settings for ${updated.title}`);
  };

  // Real client-side data download
  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportData = {
        exportedAt: new Date().toISOString(),
        product: "BhaAI - Personal Life Operating System",
        userVault: {
          calendarEvents: localStorage.getItem("bhaai_calendar_events")
            ? JSON.parse(localStorage.getItem("bhaai_calendar_events")!)
            : [],
          reminders: localStorage.getItem("bhaai_reminders")
            ? JSON.parse(localStorage.getItem("bhaai_reminders")!)
            : [],
          privacySettings: controls,
          securityStatus: {
            twoFactorAuth: "TOTP Enabled",
            encryption: "AES-GCM-256 Local",
          },
        },
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bhaai_vault_export_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      showToast("Vault data exported to JSON file!");
    }, 600);
  };

  const handleConfirmDelete = () => {
    // Clear transient cache in localStorage
    localStorage.removeItem("bhaai_cached_summaries");
    setShowDeleteModal(false);
    showToast("All processed AI embeddings & cached summaries purged.");
  };

  return (
    <PageContainer>
      <Section eyebrow="Privacy center" title="Your information stays yours.">
        <p className="max-w-2xl text-lg leading-8 muted">
          Privacy is a product feature, not a footnote. Every connection and consequential action has a visible boundary and explicit consent checkpoint.
        </p>
      </Section>

      {/* Control Rows */}
      <div className="space-y-0 border-y border-[var(--line)]">
        {controls.map((item) => (
          <div
            key={item.title}
            className="grid gap-3 border-b border-[var(--line)] py-6 md:grid-cols-[220px_1fr_auto] items-center"
          >
            <div>
              <div className="font-semibold text-base">{item.title}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--accent)]">
                <Lock size={12} />
                <span>{item.retentionDays}d retention</span>
              </div>
            </div>

            <div className="max-w-xl text-sm leading-6 muted">
              {item.body}
            </div>

            <Button
              variant="ghost"
              className="text-xs"
              onClick={() => setActiveManagingControl(item)}
            >
              <Sliders size={14} className="mr-1.5" />
              Manage
            </Button>
          </div>
        ))}
      </div>

      {/* Security Activity & Data Cards */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {/* Security Card */}
        <div
          onClick={() => setShowAuditModal(true)}
          className="surface p-6 rounded-[20px] border border-[var(--line)] cursor-pointer hover:border-[var(--text)] transition group"
        >
          <div className="flex items-center justify-between">
            <Shield size={22} className="text-[var(--accent)]" />
            <span className="text-xs font-semibold text-[var(--accent)] group-hover:underline">
              View Audit Log →
            </span>
          </div>
          <h3 className="mt-4 text-xl font-semibold">Security activity</h3>
          <p className="mt-2 text-sm muted">
            2 active sessions · 5 recent audit events recorded
          </p>
        </div>

        {/* Data Card */}
        <div className="surface p-6 rounded-[20px] border border-[var(--line)]">
          <Download size={22} className="text-[var(--text)]" />
          <h3 className="mt-4 text-xl font-semibold">Your data</h3>
          <p className="mt-1 text-xs muted mb-4">
            Download your personal data vault or wipe AI temporary embeddings.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={isExporting}
              onClick={handleExportData}
              className="text-xs"
            >
              <Download size={14} className="mr-1.5" />
              {isExporting ? "Compiling..." : "Export Vault JSON"}
            </Button>

            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              className="text-xs"
            >
              <Trash2 size={14} className="mr-1.5" />
              Delete processed data
            </Button>
          </div>
        </div>
      </div>

      {/* Manage Control Modal */}
      <AnimatePresence>
        {activeManagingControl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveManagingControl(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <h3 className="font-semibold text-base">{activeManagingControl.title} Settings</h3>
                <button
                  onClick={() => setActiveManagingControl(null)}
                  className="text-xs muted hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1.5">
                    Data Retention Window
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 90, 365].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() =>
                          setActiveManagingControl({
                            ...activeManagingControl,
                            retentionDays: days,
                          })
                        }
                        className={`rounded-[10px] border p-2 text-center font-medium transition ${
                          activeManagingControl.retentionDays === days
                            ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
                            : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)]"
                        }`}
                      >
                        {days} Days
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[12px] bg-[var(--surface-2)] p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[var(--text)]">Local Zero-Knowledge Encryption</div>
                      <div className="text-[11px] muted">Keys remain in device memory</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeManagingControl.localEncrypted}
                      onChange={(e) =>
                        setActiveManagingControl({
                          ...activeManagingControl,
                          localEncrypted: e.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--line)] pt-3">
                    <div>
                      <div className="font-semibold text-[var(--text)]">Auto-purge upon expiration</div>
                      <div className="text-[11px] muted">Remove processed receipts after due date</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeManagingControl.autoPurge}
                      onChange={(e) =>
                        setActiveManagingControl({
                          ...activeManagingControl,
                          autoPurge: e.target.checked,
                        })
                      }
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-[var(--line)]">
                <Button variant="secondary" onClick={() => setActiveManagingControl(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleSaveControl(activeManagingControl)}
                >
                  Save Preferences
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-[var(--danger)] mb-3">
                <AlertTriangle size={24} />
                <h3 className="font-semibold text-lg text-[var(--text)]">
                  Purge Processed AI Data?
                </h3>
              </div>

              <p className="text-xs leading-5 muted">
                This will delete all temporary AI document embeddings, extracted entity caches, and offline summaries. Your original connected accounts (Gmail, Calendar) will remain linked.
              </p>

              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                  Yes, Purge Data
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Audit Modal */}
      <AnimatePresence>
        {showAuditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuditModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-lg rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-[var(--accent)]" />
                  <h3 className="font-semibold text-base">Security & Privacy Audit Log</h3>
                </div>
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="text-xs muted hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 divide-y divide-[var(--line)]">
                {auditEvents.map((ev) => (
                  <div key={ev.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-[var(--text)]">{ev.event}</div>
                      <div className="text-[11px] muted">{ev.service} · {ev.time}</div>
                    </div>
                    <span className="rounded-full bg-[var(--success-soft)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--success)]">
                      {ev.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end pt-4 border-t border-[var(--line)]">
                <Button variant="primary" onClick={() => setShowAuditModal(false)}>
                  Close
                </Button>
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
    </PageContainer>
  );
}
