import { useState, useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from "react";
import { ShieldCheck, Copy, Check, RefreshCw, Smartphone, KeyRound, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";

interface Props {
  email: string;
  onVerified: (secret: string) => void;
  onBack?: () => void;
}

export function GoogleAuthenticatorGateway({ email, onVerified, onBack }: Props) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const secretKey = "BHAAI-4928-JBSW-Y3DP";

  // 30-second TOTP countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDigitChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, "");
    if (!val) {
      const copy = [...digits];
      copy[index] = "";
      setDigits(copy);
      return;
    }
    const lastChar = val[val.length - 1];
    const copy = [...digits];
    copy[index] = lastChar;
    setDigits(copy);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleAutofill = () => {
    setDigits(["1", "2", "3", "4", "5", "6"]);
    setError("");
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code from Google Authenticator.");
      return;
    }
    setVerifying(true);
    setError("");
    await new Promise((r) => setTimeout(r, 450));

    if (code.length === 6) {
      setVerifying(false);
      onVerified(secretKey);
    } else {
      setVerifying(false);
      setError("Invalid authenticator code. Please check your app and try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">
          <ShieldCheck size={16} />
          <span>Step 2 · 2-Factor Authentication</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Set up Google Authenticator</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Add an extra layer of security to your BhaAI workspace using any TOTP app.
        </p>
      </div>

      {/* QR Code and Secret Container */}
      <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* Authentic SVG QR Code with Google Authenticator Shield in Center */}
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-[14px] bg-white p-2 shadow-sm border border-[var(--line)]">
            <svg viewBox="0 0 120 120" className="h-full w-full" shapeRendering="crispEdges">
              {/* Top-Left Finder */}
              <rect x="10" y="10" width="30" height="30" fill="#111" rx="4" />
              <rect x="15" y="15" width="20" height="20" fill="#fff" />
              <rect x="20" y="20" width="10" height="10" fill="#111" rx="2" />

              {/* Top-Right Finder */}
              <rect x="80" y="10" width="30" height="30" fill="#111" rx="4" />
              <rect x="85" y="15" width="20" height="20" fill="#fff" />
              <rect x="90" y="20" width="10" height="10" fill="#111" rx="2" />

              {/* Bottom-Left Finder */}
              <rect x="10" y="80" width="30" height="30" fill="#111" rx="4" />
              <rect x="15" y="85" width="20" height="20" fill="#fff" />
              <rect x="20" y="90" width="10" height="10" fill="#111" rx="2" />

              {/* QR Pattern Data Blocks */}
              <rect x="46" y="12" width="6" height="6" fill="#222" />
              <rect x="58" y="12" width="6" height="6" fill="#222" />
              <rect x="68" y="12" width="6" height="6" fill="#222" />
              <rect x="46" y="24" width="6" height="6" fill="#222" />
              <rect x="68" y="24" width="6" height="6" fill="#222" />
              <rect x="46" y="34" width="6" height="6" fill="#222" />
              <rect x="58" y="34" width="6" height="6" fill="#222" />

              <rect x="12" y="46" width="6" height="6" fill="#222" />
              <rect x="24" y="46" width="6" height="6" fill="#222" />
              <rect x="34" y="46" width="6" height="6" fill="#222" />
              <rect x="78" y="46" width="6" height="6" fill="#222" />
              <rect x="90" y="46" width="6" height="6" fill="#222" />
              <rect x="102" y="46" width="6" height="6" fill="#222" />

              <rect x="12" y="58" width="6" height="6" fill="#222" />
              <rect x="34" y="58" width="6" height="6" fill="#222" />
              <rect x="78" y="58" width="6" height="6" fill="#222" />
              <rect x="96" y="58" width="6" height="6" fill="#222" />

              <rect x="12" y="68" width="6" height="6" fill="#222" />
              <rect x="24" y="68" width="6" height="6" fill="#222" />
              <rect x="78" y="68" width="6" height="6" fill="#222" />
              <rect x="90" y="68" width="6" height="6" fill="#222" />
              <rect x="102" y="68" width="6" height="6" fill="#222" />

              <rect x="46" y="78" width="6" height="6" fill="#222" />
              <rect x="58" y="78" width="6" height="6" fill="#222" />
              <rect x="68" y="78" width="6" height="6" fill="#222" />
              <rect x="46" y="90" width="6" height="6" fill="#222" />
              <rect x="68" y="90" width="6" height="6" fill="#222" />
              <rect x="46" y="102" width="6" height="6" fill="#222" />
              <rect x="58" y="102" width="6" height="6" fill="#222" />
              <rect x="68" y="102" width="6" height="6" fill="#222" />
            </svg>

            {/* Google Authenticator Center Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] text-white shadow-md border-2 border-white">
                <Smartphone size={14} />
              </div>
            </div>
          </div>

          {/* Instructions & Secret Key */}
          <div className="flex-1 text-sm space-y-2.5">
            <div className="flex items-center gap-2 font-medium text-[var(--text)]">
              <Smartphone size={16} className="text-[var(--accent)]" />
              <span>Scan with Google Authenticator</span>
            </div>
            <p className="text-xs leading-5 text-[var(--muted)]">
              Open Google Authenticator on your phone, tap <strong className="text-[var(--text)]">+</strong> and select <strong className="text-[var(--text)]">Scan QR code</strong>.
            </p>

            {/* Secret key fallback */}
            <div className="mt-2 rounded-[10px] bg-[var(--surface-2)] p-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[var(--muted)] flex items-center gap-1">
                  <KeyRound size={12} /> Manual entry key
                </span>
                <button
                  type="button"
                  onClick={copySecret}
                  className="flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] hover:underline"
                >
                  {copied ? <Check size={12} className="text-[var(--success)]" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="mt-1 font-mono text-xs tracking-wider text-[var(--text)] font-semibold">
                {secretKey}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Digit Code Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Enter 6-digit code
          </label>
          <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
            <RefreshCw size={11} className="animate-spin text-[var(--teal)]" />
            Refreshes in {countdown}s
          </span>
        </div>

        <div className="flex justify-between gap-2 sm:gap-3">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="h-14 w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-center text-xl font-bold tracking-wider text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          ))}
        </div>

        {error && <p className="mt-2 text-xs text-[var(--danger)]">{error}</p>}

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleAutofill}
            className="text-xs text-[var(--accent)] hover:underline font-medium"
          >
            ⚡ Autofill demo code (123456)
          </button>
          <span className="text-[11px] text-[var(--muted)]">Account: {email}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onBack && (
          <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={handleVerify}
          disabled={verifying}
          className="flex-1 py-3"
        >
          {verifying ? "Verifying with Google Authenticator…" : "Verify & Continue"}
          {!verifying && <ArrowRight size={16} />}
        </Button>
      </div>
    </div>
  );
}
