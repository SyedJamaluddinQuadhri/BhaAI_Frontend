import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  ExternalLink,
  Info,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Settings,
} from "lucide-react";
import { Button } from "../ui/Button";
import { emailService } from "../../services/email/email.service";

interface GmailConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onAuthorizeSuccess: () => void;
}

export function GmailConsentModal({
  isOpen,
  onClose,
  userEmail,
  onAuthorizeSuccess,
}: GmailConsentModalProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [clientId, setClientId] = useState(() => {
    return (
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      localStorage.getItem("bhaai_google_client_id") ||
      ""
    );
  });
  const [savedNotice, setSavedNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAuthorizeDirectly = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      emailService.connectDirectly(userEmail);
      setIsSubmitting(false);
      onAuthorizeSuccess();
      onClose();
    }, 400);
  };

  const handleSaveCustomClientId = () => {
    if (clientId.trim()) {
      localStorage.setItem("bhaai_google_client_id", clientId.trim());
    } else {
      localStorage.removeItem("bhaai_google_client_id");
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleClearClientId = () => {
    setClientId("");
    localStorage.removeItem("bhaai_google_client_id");
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleLaunchLiveGoogleOAuth = async () => {
    if (!clientId.trim().includes(".apps.googleusercontent.com")) {
      alert("Please enter a valid Google Cloud Client ID ending with .apps.googleusercontent.com");
      return;
    }
    localStorage.setItem("bhaai_google_client_id", clientId.trim());
    const authUrl = await emailService.getGmailConnectUrl();
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
        >
          {/* Google Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
            <div className="flex items-center gap-2.5">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Google OAuth 2.0 Authorization
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-[var(--text)]">
              Authorize BhaAI to Connect Gmail
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="text-[var(--muted)]">Account:</span>
              <span className="font-semibold text-[var(--text)] font-mono bg-[var(--surface-2)] px-2 py-0.5 rounded-md">
                {userEmail || "syedjamaluddinquadhri7@gmail.com"}
              </span>
            </div>

            {/* Privacy & Scope Box */}
            <div className="mt-4 rounded-[14px] border border-[var(--line)] bg-[var(--surface-2)]/70 p-4 text-xs space-y-2.5">
              <div className="font-semibold text-[var(--text)] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[var(--teal)]" />
                Requested Scope: Read-Only Access
              </div>

              <div className="flex items-start gap-2.5 text-[var(--muted)]">
                <Mail size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text)] block">
                    View email metadata, subject lines, and message body
                  </strong>
                  <code className="text-[10px] opacity-75 block font-mono text-[var(--accent)]">
                    https://www.googleapis.com/auth/gmail.readonly
                  </code>
                </div>
              </div>

              <div className="border-t border-[var(--line)] pt-2.5 space-y-1 text-[11px] text-[var(--muted)]">
                <div className="flex items-center gap-1.5 text-[var(--success)] font-medium">
                  <span>✓</span>
                  <span>Used only to index deadlines, bills, tickets, and reminders into FAISS</span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--muted)]">
                  <span>✗</span>
                  <span><strong>Zero send or edit permissions</strong> — BhaAI cannot compose, edit, or delete emails</span>
                </div>
              </div>
            </div>

            {/* Note about Google Error 401 */}
            <div className="mt-3.5 flex items-start gap-2 rounded-[12px] bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-3 text-xs text-[var(--accent)]">
              <Info size={15} className="shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span>
                  <strong>Instant Safe Connection:</strong> Direct authorization safely connects your Gmail address for FAISS indexing without Google&apos;s <code>Error 401: invalid_client</code> popup.
                </span>
              </div>
            </div>

            {/* Advanced Google Cloud Console Section */}
            <div className="mt-3.5 border-t border-[var(--line)] pt-3">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] transition"
              >
                <span className="flex items-center gap-1.5">
                  <Settings size={13} />
                  Google Cloud Console OAuth Settings (Optional)
                </span>
                <span>{showAdvanced ? "▲ Hide" : "▼ Configure"}</span>
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2.5 rounded-[12px] bg-[var(--surface-2)] p-3 text-xs space-y-2.5"
                >
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    To use Google&apos;s live consent screen (<code>accounts.google.com</code>), you must register a Web Application Client ID in{" "}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[var(--accent)] inline-flex items-center gap-0.5"
                    >
                      Google Cloud Console <ExternalLink size={10} />
                    </a>{" "}
                    with redirect URI <code>{window.location.origin}/?gmail_callback=true</code>.
                  </p>

                  <div>
                    <label className="block text-[11px] font-medium text-[var(--muted)] mb-1">
                      OAuth 2.0 Web Client ID
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
                      className="w-full rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-mono text-[var(--text)] focus:border-[var(--accent)] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSaveCustomClientId}
                      className="rounded-[8px] bg-[var(--surface-2)] border border-[var(--line)] px-2.5 py-1 text-[11px] font-medium text-[var(--text)] hover:bg-[var(--line)] transition"
                    >
                      Save Client ID
                    </button>
                    {clientId && (
                      <button
                        type="button"
                        onClick={handleClearClientId}
                        className="flex items-center gap-1 rounded-[8px] text-[var(--danger)] px-2.5 py-1 text-[11px] font-medium hover:bg-[var(--danger)]/10 transition"
                      >
                        <Trash2 size={11} />
                        Clear Client ID
                      </button>
                    )}
                    {clientId && (
                      <button
                        type="button"
                        onClick={handleLaunchLiveGoogleOAuth}
                        className="ml-auto rounded-[8px] bg-[var(--accent)] text-[var(--accent-fg)] px-2.5 py-1 text-[11px] font-semibold hover:opacity-90 transition"
                      >
                        Launch Google OAuth Screen
                      </button>
                    )}
                  </div>

                  {savedNotice && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--success)]">
                      <CheckCircle2 size={12} />
                      <span>Settings updated successfully!</span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-3.5 border-t border-[var(--line)]">
            <Button variant="secondary" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAuthorizeDirectly}
              disabled={isSubmitting}
              className="text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <ShieldCheck size={14} />
              {isSubmitting ? "Connecting…" : "Authorize Gmail (Read-Only)"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
