import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Mail,
  Smartphone,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth/auth.service";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { GoogleAuthenticatorGateway } from "../components/GoogleAuthenticatorGateway";
import { GmailAccessGateway } from "../components/GmailAccessGateway";
import { BhaAIIcon } from "../../../components/shared/BhaAIIcon";

type SignupStep = "account" | "authenticator" | "gmail" | "complete";
type LoginStep = "credentials" | "authenticator";

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<"login" | "signup">(
    location.pathname === "/signup" ? "signup" : "login"
  );

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Multi-step gateway states
  const [signupStep, setSignupStep] = useState<SignupStep>("account");
  const [loginStep, setLoginStep] = useState<LoginStep>("credentials");
  const [authSecret, setAuthSecret] = useState("BHAAI-4928-JBSW-Y3DP");
  const [totpCode, setTotpCode] = useState("");
  const [connectedGmail, setConnectedGmail] = useState("");

  // Step 1 Submit (Signup)
  function handleAccountSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }
    // Proceed to Step 2: Google Authenticator Gateway
    setSignupStep("authenticator");
  }

  // Step 2 Completed: Authenticator 2FA Verified
  function handleAuthenticatorVerified(secret: string) {
    setAuthSecret(secret);
    // Proceed to Step 3: Gmail Access Gateway
    setSignupStep("gmail");
  }

  // Step 3 Completed: Gmail Access Gateway Authorized
  async function handleGmailConnected(gmailAccount: string) {
    setConnectedGmail(gmailAccount);
    setLoading(true);
    try {
      await authService.signup(name, email, password, {
        twoFactorEnabled: true,
        googleAuthSecret: authSecret,
        gmailConnected: true,
        gmailAddress: gmailAccount,
      });
      setSignupStep("complete");
    } catch {
      setError("Failed to create workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 3 Skip (Gmail access deferred)
  async function handleSkipGmail() {
    setLoading(true);
    try {
      await authService.signup(name, email, password, {
        twoFactorEnabled: true,
        googleAuthSecret: authSecret,
        gmailConnected: false,
      });
      setSignupStep("complete");
    } catch {
      setError("Failed to complete setup.");
    } finally {
      setLoading(false);
    }
  }

  // Step 4: Finish setup and enter workspace
  function handleEnterWorkspace() {
    navigate("/assistant");
  }

  // Login flow
  async function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    // Switch to Authenticator step for 2FA
    setLoginStep("authenticator");
  }

  async function handleLoginVerifyTOTP(e: FormEvent) {
    e.preventDefault();
    if (totpCode.length < 6) {
      setError("Enter the 6-digit Google Authenticator code.");
      return;
    }
    setLoading(true);
    try {
      await authService.login(email, password, totpCode);
      navigate("/assistant");
    } catch {
      setError("Invalid code or credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Quick Google Sign-In button simulation
  function handleContinueWithGoogle() {
    setName("Jamal Ahmed");
    setEmail("jamal.ahmed@gmail.com");
    setPassword("google-auth-pass-123");
    setSignupStep("authenticator");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg)]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[1.05fr_.95fr]">
        {/* Left Branding Hero */}
        <section className="relative hidden overflow-hidden border-r border-[var(--line)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 20% 25%, rgba(77,95,215,.18), transparent 34%), radial-gradient(circle at 80% 75%, rgba(23,124,114,.10), transparent 28%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-3">
              <BhaAIIcon size={42} />
              <div className="text-xl font-bold tracking-tight">BhaAI</div>
            </div>
          </div>

          <div className="relative max-w-2xl py-16">
            <div className="eyebrow mb-6">Personal AI life operating system</div>
            <h1 className="display">
              Stop remembering.
              <br />
              <span className="muted">Start living.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 muted">
              BhaAI turns the information scattered across your inbox, documents, and calendar
              into context you can actually use.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/70 px-4 py-2 text-sm">
                <ShieldCheck size={16} className="text-[var(--teal)]" /> Google Authenticator 2FA
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/70 px-4 py-2 text-sm">
                <Mail size={16} className="text-[var(--accent)]" /> Gmail OAuth Gateway
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/70 px-4 py-2 text-sm">
                <Sparkles size={16} className="text-[var(--warning)]" /> Context-aware AI
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-between text-xs muted">
            <span>Private by design. Your information stays yours.</span>
            <span>Secured with TOTP & OAuth 2.0</span>
          </div>
        </section>

        {/* Right Authentication & Gateway Section */}
        <section className="flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[500px] my-auto"
          >
            {/* Mobile Branding */}
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <BhaAIIcon size={40} />
                <div className="text-xl font-bold">BhaAI</div>
              </div>
            </div>

            {/* Mode Selector (Login vs Sign up) - Only show when at initial step */}
            {(mode === "login" || (mode === "signup" && signupStep === "account")) && (
              <div className="mb-6 flex rounded-[13px] bg-[var(--surface-2)] p-1">
                <button
                  onClick={() => {
                    setMode("login");
                    setLoginStep("credentials");
                    setError("");
                  }}
                  className={`flex-1 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition ${
                    mode === "login" ? "bg-[var(--surface)] shadow-sm" : "muted"
                  }`}
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMode("signup");
                    setSignupStep("account");
                    setError("");
                  }}
                  className={`flex-1 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition ${
                    mode === "signup" ? "bg-[var(--surface)] shadow-sm" : "muted"
                  }`}
                >
                  Sign up (with Gateway)
                </button>
              </div>
            )}

            {/* ══════════════════ SIGNUP FLOW ══════════════════ */}
            {mode === "signup" && (
              <div>
                {/* Step indicator bar */}
                {signupStep !== "complete" && (
                  <div className="mb-6 flex items-center justify-between border-b border-[var(--line)] pb-3 text-xs">
                    <span
                      className={`font-semibold ${
                        signupStep === "account" ? "text-[var(--text)]" : "text-[var(--muted)]"
                      }`}
                    >
                      1. Account
                    </span>
                    <span className="text-[var(--line)]">→</span>
                    <span
                      className={`font-semibold ${
                        signupStep === "authenticator" ? "text-[var(--teal)]" : "text-[var(--muted)]"
                      }`}
                    >
                      2. Authenticator 2FA
                    </span>
                    <span className="text-[var(--line)]">→</span>
                    <span
                      className={`font-semibold ${
                        signupStep === "gmail" ? "text-[var(--accent)]" : "text-[var(--muted)]"
                      }`}
                    >
                      3. Gmail Gateway
                    </span>
                  </div>
                )}

                {/* SIGNUP STEP 1: Account Info */}
                {signupStep === "account" && (
                  <div>
                    <div className="eyebrow mb-2">Registration Gateway</div>
                    <h2 className="text-3xl font-semibold tracking-tight">Create your BhaAI</h2>
                    <p className="mt-2 text-sm muted">
                      One secure workspace with Google Authenticator and Gmail intelligence.
                    </p>

                    {/* Quick Continue with Google */}
                    <button
                      type="button"
                      onClick={handleContinueWithGoogle}
                      className="mt-6 flex w-full items-center justify-center gap-3 rounded-[13px] border border-[var(--line)] bg-[var(--surface)] py-3 text-sm font-semibold transition hover:bg-[var(--surface-2)]"
                    >
                      {/* Google G SVG */}
                      <svg viewBox="0 0 24 24" className="h-4 w-4">
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
                      Continue with Google
                    </button>

                    <div className="relative my-6 text-center text-xs muted">
                      <span className="bg-[var(--bg)] px-3">or register with email</span>
                      <div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-[var(--line)]" />
                    </div>

                    <form onSubmit={handleAccountSubmit} className="space-y-4">
                      <Input
                        autoComplete="name"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <Input
                        autoComplete="email"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="relative">
                        <Input
                          autoComplete="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password (min. 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 muted"
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>

                      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

                      <Button type="submit" className="w-full py-3">
                        Continue to Authenticator 2FA <ArrowRight size={16} />
                      </Button>
                    </form>
                  </div>
                )}

                {/* SIGNUP STEP 2: Google Authenticator TOTP Gateway */}
                {signupStep === "authenticator" && (
                  <GoogleAuthenticatorGateway
                    email={email || "user@bhaai.local"}
                    onVerified={handleAuthenticatorVerified}
                    onBack={() => setSignupStep("account")}
                  />
                )}

                {/* SIGNUP STEP 3: Gmail Access Gateway */}
                {signupStep === "gmail" && (
                  <GmailAccessGateway
                    email={email || "user@gmail.com"}
                    onConnected={handleGmailConnected}
                    onSkip={handleSkipGmail}
                  />
                )}

                {/* SIGNUP STEP 4: Complete & Launch Workspace */}
                {signupStep === "complete" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
                      <CheckCircle2 size={36} />
                    </div>

                    <div>
                      <div className="eyebrow mb-2">Setup complete</div>
                      <h2 className="text-3xl font-bold tracking-tight">
                        Your BhaAI is ready, {name || "there"}!
                      </h2>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Authentication and connected intelligence are configured.
                      </p>
                    </div>

                    <div className="space-y-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-5 text-left text-sm">
                      <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                        <span className="flex items-center gap-2 font-medium">
                          <Smartphone size={16} className="text-[var(--teal)]" />
                          Google Authenticator 2FA
                        </span>
                        <span className="rounded-full bg-[var(--success)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--success)]">
                          Active & Verified
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-2 font-medium">
                          <Mail size={16} className="text-[var(--accent)]" />
                          Gmail Gateway
                        </span>
                        <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                          {connectedGmail ? `${connectedGmail} (4 emails synced)` : "Active"}
                        </span>
                      </div>
                    </div>

                    <Button onClick={handleEnterWorkspace} className="w-full py-3.5 text-base">
                      Launch BhaAI AI Chatbot <Sparkles size={18} />
                    </Button>
                  </motion.div>
                )}
              </div>
            )}

            {/* ══════════════════ LOGIN FLOW ══════════════════ */}
            {mode === "login" && (
              <div>
                {loginStep === "credentials" && (
                  <div>
                    <div className="eyebrow mb-2">Welcome back</div>
                    <h2 className="text-3xl font-semibold tracking-tight">Good to see you.</h2>
                    <p className="mt-2 text-sm muted">Your life context and AI assistant are waiting.</p>

                    <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
                      <Input
                        autoComplete="email"
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="relative">
                        <Input
                          autoComplete="current-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          aria-label="Toggle password visibility"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 muted"
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>

                      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

                      <Button disabled={loading} className="w-full py-3">
                        Continue to 2FA Verification <ArrowRight size={16} />
                      </Button>
                    </form>

                    <div className="mt-6 border-t border-[var(--line)] pt-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("jamal@gmail.com");
                          setPassword("demo-password");
                          setLoginStep("authenticator");
                        }}
                        className="text-xs text-[var(--accent)] hover:underline font-medium"
                      >
                        ⚡ 1-Click Demo Login as Jamal
                      </button>
                    </div>
                  </div>
                )}

                {/* Login Step 2: Google Authenticator Code */}
                {loginStep === "authenticator" && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">
                        <Lock size={15} />
                        <span>2-Factor Authentication</span>
                      </div>
                      <h2 className="mt-2 text-2xl font-bold tracking-tight">
                        Google Authenticator Code
                      </h2>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Enter the 6-digit verification code from your Google Authenticator app for{" "}
                        <strong className="text-[var(--text)]">{email}</strong>.
                      </p>
                    </div>

                    <form onSubmit={handleLoginVerifyTOTP} className="space-y-4">
                      <div>
                        <Input
                          autoComplete="one-time-code"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="6-digit code (e.g. 123456)"
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                          className="text-center text-xl font-bold tracking-widest"
                          required
                          autoFocus
                        />
                      </div>

                      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

                      <div className="flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => setTotpCode("123456")}
                          className="text-[var(--accent)] hover:underline font-medium"
                        >
                          ⚡ Autofill (123456)
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoginStep("credentials")}
                          className="muted hover:underline"
                        >
                          Back to password
                        </button>
                      </div>

                      <Button disabled={loading} type="submit" className="w-full py-3">
                        {loading ? "Verifying code…" : "Verify & Log in"}
                        {!loading && <ArrowRight size={16} />}
                      </Button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
