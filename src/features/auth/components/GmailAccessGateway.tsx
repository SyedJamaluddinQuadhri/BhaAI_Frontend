import { useState } from "react";
import { Mail, Shield, Check, Lock, ArrowRight, LoaderCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface Props {
  email: string;
  onConnected: (account: string) => void;
  onSkip?: () => void;
}

export function GmailAccessGateway({ email, onConnected, onSkip }: Props) {
  const [connecting, setConnecting] = useState(false);
  const [stage, setStage] = useState<number>(0);
  const [selectedEmail, setSelectedEmail] = useState(email || "jamal.ahmed@gmail.com");

  const permissions = [
    {
      title: "Read email messages & metadata",
      desc: "Allows BhaAI to extract deadlines, bills, tickets, and policy dates.",
      scope: "https://www.googleapis.com/auth/gmail.readonly",
      required: true,
    },
    {
      title: "Detect action items & deadlines",
      desc: "Identifies urgent follow-ups from universities, employers, and providers.",
      scope: "bhaai.inbox.insights",
      required: true,
    },
    {
      title: "Automatic sync frequency",
      desc: "Continuously keeps your life operating system up to date in background.",
      scope: "bhaai.sync.periodic",
      required: false,
    },
  ];

  const handleAuthorize = async () => {
    setConnecting(true);
    setStage(1); // OAuth handshake
    await new Promise((r) => setTimeout(r, 600));

    setStage(2); // Connecting Gmail API
    await new Promise((r) => setTimeout(r, 700));

    setStage(3); // Fetching inbox messages
    await new Promise((r) => setTimeout(r, 650));

    setStage(4); // Done
    await new Promise((r) => setTimeout(r, 400));

    setConnecting(false);
    onConnected(selectedEmail);
  };

  return (
    <div className="space-y-6">
      {/* Step Eyebrow */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          <Mail size={16} />
          <span>Step 3 · Gmail Gateway</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Connect your Gmail to BhaAI</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Grant BhaAI read-only access to understand your emails, bills, and deadlines automatically.
        </p>
      </div>

      {/* Google OAuth Styled Container */}
      <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
        {/* Google Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-3">
            {/* Google G Logo SVG */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Google Identity Gateway</div>
              <div className="text-[11px] text-[var(--muted)]">OAuth 2.0 API Consent</div>
            </div>
          </div>
          <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)]">
            Verified Partner
          </span>
        </div>

        {/* Selected Account Card */}
        <div className="mt-4 flex items-center justify-between rounded-[14px] bg-[var(--surface-2)] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text)] text-xs font-bold text-[var(--bg)]">
              {selectedEmail[0]?.toUpperCase() || "G"}
            </div>
            <div>
              <div className="text-sm font-semibold">{selectedEmail}</div>
              <div className="text-[11px] text-[var(--muted)]">Default Google Account</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const newAcc = prompt("Enter Google account email:", selectedEmail);
              if (newAcc) setSelectedEmail(newAcc);
            }}
            className="text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            Switch
          </button>
        </div>

        {/* Permissions Requested */}
        <div className="mt-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            BhaAI is requesting the following permissions:
          </div>

          {permissions.map((p) => (
            <div
              key={p.title}
              className="flex items-start gap-3 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] p-3"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-white">
                <Check size={12} strokeWidth={3} />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-semibold text-[var(--text)]">{p.title}</div>
                <div className="text-[var(--muted)] mt-0.5">{p.desc}</div>
                <div className="mt-1 font-mono text-[10px] text-[var(--muted)] opacity-70">
                  scope: {p.scope}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy Note */}
        <div className="mt-5 flex items-center gap-2.5 rounded-[12px] bg-[var(--teal)]/10 p-3 text-xs text-[var(--teal)]">
          <Lock size={15} className="shrink-0" />
          <span>
            <strong>Read-only privacy guarantee:</strong> BhaAI cannot send, modify, or delete your emails.
          </span>
        </div>

        {/* Handshake Progress indicator */}
        {connecting && (
          <div className="mt-5 rounded-[14px] border border-[var(--accent)]/30 bg-[var(--accent-soft)] p-4">
            <div className="flex items-center gap-3">
              <LoaderCircle size={18} className="animate-spin text-[var(--accent)] shrink-0" />
              <div className="text-xs">
                {stage === 1 && <span className="font-semibold">Establishing Google OAuth 2.0 handshake…</span>}
                {stage === 2 && <span className="font-semibold">Connecting to Gmail API endpoint…</span>}
                {stage === 3 && <span className="font-semibold">Syncing inbox metadata (4 actionable emails found)…</span>}
                {stage === 4 && <span className="font-semibold text-[var(--success)]">Connected successfully!</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onSkip && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSkip}
            disabled={connecting}
            className="flex-1"
          >
            Skip for now
          </Button>
        )}
        <Button
          type="button"
          onClick={handleAuthorize}
          disabled={connecting}
          className="flex-1 py-3"
        >
          {connecting ? "Connecting Gateway…" : "Grant Gmail Access & Connect"}
          {!connecting && <ArrowRight size={16} />}
        </Button>
      </div>
    </div>
  );
}
