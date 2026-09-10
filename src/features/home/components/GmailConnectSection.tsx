import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  Database,
  Lock,
  Check,
} from "lucide-react";
import {
  emailService,
  type GmailConnectionState,
  type GmailStatus,
} from "../../../services/email/email.service";
import { authService } from "../../../services/auth/auth.service";
import { Button } from "../../../components/ui/Button";
import { GmailConsentModal } from "../../../components/shared/GmailConsentModal";

export function GmailConnectSection() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<GmailConnectionState>("not_connected");
  const [status, setStatus] = useState<GmailStatus>({ connected: false });
  const [syncStage, setSyncStage] = useState<string>("");
  const [syncResult, setSyncResult] = useState<{ count: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Initialize and handle Google OAuth redirect callback
  useEffect(() => {
    const initStatus = async () => {
      // Check if redirected back from Google OAuth
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");
      const isCallback = searchParams.get("gmail_callback");

      if (errorParam) {
        setState("error");
        setErrorMessage("Gmail connection was cancelled or permission was not granted.");
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }

      if (code || isCallback) {
        setState("connecting");
        try {
          const updated = emailService.handleCallback(code || "oauth_success");
          setStatus(updated);
          setState("connected");
        } catch {
          setState("error");
          setErrorMessage("Failed to complete Gmail authorization.");
        }
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }

      // Check current status from backend
      try {
        const current = await emailService.getGmailStatus();
        setStatus(current);
        if (current.connected) {
          setState("connected");
        } else {
          setState("not_connected");
        }
      } catch {
        setState("not_connected");
      }
    };

    initStatus();
  }, [searchParams]);

  // Connect Gmail flow
  const handleConnectGmail = () => {
    setErrorMessage(null);
    setShowConsentModal(true);
  };


  // Disconnect flow
  const handleDisconnect = async () => {
    try {
      await emailService.disconnectGmail();
      setStatus({ connected: false });
      setState("not_connected");
      setSyncResult(null);
    } catch {
      setStatus({ connected: false });
      setState("not_connected");
    }
  };

  // Sync Emails flow
  const handleSyncEmails = async () => {
    setState("syncing");
    setErrorMessage(null);
    setSyncResult(null);

    // Progressive stage feedback
    setSyncStage("Fetching messages via Gmail API…");
    await new Promise((r) => setTimeout(r, 600));

    setSyncStage("Processing email bodies & normalising…");
    await new Promise((r) => setTimeout(r, 600));

    setSyncStage("Generating Sentence Transformer embeddings…");
    await new Promise((r) => setTimeout(r, 600));

    setSyncStage("Updating Email FAISS index on EC2…");

    try {
      const res = await emailService.syncGmail();
      setSyncResult({ count: res.synced_count });
      setStatus((prev) => ({
        ...prev,
        last_sync: "Just now",
        total_indexed: res.synced_count,
      }));
      setState("connected");
    } catch (err: unknown) {
      console.error("[BhaAI Gmail] Sync error:", err);
      setState("error");
      setErrorMessage("Failed to synchronize emails with backend. Check EC2 status.");
    }
  };

  const session = authService.getSession();
  const displayEmail = status.email || session?.user?.email || "syedjamaluddinquadhri7@gmail.com";

  return (
    <div className="mt-8 overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8 shadow-sm transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent)] shadow-sm">
            <Mail size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Step 2: Gmail Intelligence
              </span>
              {state === "connected" && (
                <span className="flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--success)]">
                  <CheckCircle2 size={12} />
                  Connected
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
              {state === "connected" ? "Gmail Connected" : "Gmail"}
            </h2>
          </div>
        </div>

        {/* Security badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-2)] px-3 py-1 text-xs text-[var(--muted)]">
          <ShieldCheck size={13} className="text-[var(--teal)]" />
          <span>Read-only (`gmail.readonly`)</span>
        </div>
      </div>

      {/* State 1: Not Connected */}
      {state === "not_connected" && (
        <div className="mt-5">
          <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
            Connect your Gmail account to allow BhaAI to search your emails and use them when answering your questions. BhaAI only requests read-only access to parse invoices, deadlines, and notifications.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={handleConnectGmail} className="text-xs py-2.5 px-5">
              <Mail size={15} className="mr-1.5" />
              Connect Gmail
            </Button>
            <span className="text-xs text-[var(--muted)]">
              Requests read-only permission (`gmail.readonly`)
            </span>
          </div>
        </div>
      )}

      {/* State 2: Connecting */}
      {state === "connecting" && (
        <div className="mt-5 py-4">
          <div className="flex items-center gap-3">
            <RefreshCw size={20} className="animate-spin text-[var(--accent)]" />
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">
                Authorizing Gmail Access…
              </div>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Establishing read-only permission boundary for {displayEmail}…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* State 3: Connected */}
      {state === "connected" && (
        <div className="mt-5">
          <div className="rounded-[16px] border border-[var(--line)] bg-[var(--surface-2)]/50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />
                <span className="font-semibold text-[var(--text)]">
                  Connected as {displayEmail}
                </span>
                {status.last_sync && (
                  <span className="text-[var(--muted)]">· Last sync: {status.last_sync}</span>
                )}
              </div>

              {status.total_indexed !== undefined && status.total_indexed > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--accent)] font-medium">
                  <Database size={13} />
                  <span>{status.total_indexed.toLocaleString()} emails in FAISS index</span>
                </div>
              )}
            </div>

            <p className="mt-2 text-xs text-[var(--muted)] leading-5">
              Your Gmail account is connected to BhaAI. You can ask BhaAI about bills, upcoming meetings, deadlines, and tickets received in your inbox.
            </p>
          </div>

          {/* Sync Success Banner */}
          {syncResult && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 rounded-[14px] bg-[var(--success-soft)] p-3 text-xs font-semibold text-[var(--success)]"
            >
              <CheckCircle2 size={15} />
              <span>✓ Gmail synced · {syncResult.count.toLocaleString()} emails indexed into Email FAISS</span>
            </motion.div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              onClick={handleSyncEmails}
              className="text-xs py-2 px-4"
            >
              <RefreshCw size={14} className="mr-1.5" />
              Sync Emails
            </Button>

            <Button
              variant="secondary"
              onClick={handleDisconnect}
              className="text-xs py-2 px-3 text-[var(--danger)] hover:bg-[var(--danger-soft)]"
            >
              <LogOut size={13} className="mr-1.5" />
              Disconnect
            </Button>
          </div>
        </div>
      )}

      {/* State 4: Syncing */}
      {state === "syncing" && (
        <div className="mt-5 space-y-3 py-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[var(--accent)]">
              <RefreshCw size={13} className="animate-spin" />
              Syncing your emails…
            </span>
            <span className="text-[var(--muted)] font-mono">POST /v1/gmail/sync</span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <motion.div
              initial={{ width: "10%" }}
              animate={{ width: "90%" }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--teal)]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <Layers size={13} className="text-[var(--teal)] shrink-0" />
            <span>{syncStage}</span>
          </div>
        </div>
      )}

      {/* State 5: Error */}
      {state === "error" && (
        <div className="mt-5">
          <div className="flex items-center gap-2.5 rounded-[14px] border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-4 text-xs text-[var(--danger)]">
            <AlertCircle size={17} className="shrink-0" />
            <div>
              <div className="font-semibold">Gmail was not connected.</div>
              <div className="mt-0.5 opacity-90">{errorMessage || "The authorization request could not be completed."}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="primary" onClick={handleConnectGmail} className="text-xs">
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => setState("not_connected")} className="text-xs">
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Google OAuth Consent Screen Modal */}
      <GmailConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        userEmail={displayEmail}
        onAuthorizeSuccess={() => {
          const updated = emailService.connectDirectly(displayEmail);
          setStatus(updated);
          setState("connected");
        }}
      />
    </div>
  );
}
