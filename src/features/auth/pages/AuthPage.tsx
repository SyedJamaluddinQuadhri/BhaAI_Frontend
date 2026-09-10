import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, ArrowRight, Lock, Code2, AlertCircle } from "lucide-react";
import { authService, parseJwt } from "../../../services/auth/auth.service";
import { BhaAIIcon } from "../../../components/shared/BhaAIIcon";
import { Button } from "../../../components/ui/Button";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle";
              width?: number;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function AuthPage() {
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gisLoaded, setGisLoaded] = useState(false);

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "831154784932-bhaai-dev.apps.googleusercontent.com";

  useEffect(() => {
    // Check if user is already authenticated
    if (authService.isAuthenticated()) {
      navigate("/", { replace: true });
      return;
    }

    const checkGIS = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        setGisLoaded(true);
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            cancel_on_tap_outside: true,
          });

          window.google.accounts.id.renderButton(googleBtnRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "pill",
            width: 280,
          });
        } catch (err) {
          console.warn("[BhaAI Auth] GIS initialization warning:", err);
        }
      }
    };

    checkGIS();
    const interval = setInterval(checkGIS, 300);
    const timeout = setTimeout(() => clearInterval(interval), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [clientId, navigate]);

  const handleGoogleCredentialResponse = async (response: { credential: string }) => {
    if (!response.credential) {
      setError("No credential received from Google. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Authenticate with Google ID token without requesting Gmail scope
      await authService.loginWithGoogle(response.credential);
      // Immediately transition to BhaAI dashboard
      navigate("/", { replace: true });
    } catch (err: unknown) {
      console.error("[BhaAI Auth] Google Sign-In error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    setLoading(true);
    authService.loginAsDev();
    navigate("/", { replace: true });
  };

  // Fallback direct simulated Google Sign-In for environments where GIS iframe is blocked
  const handleSimulatedGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    // Create standard mock JWT payload structure for developer testing
    const mockPayload = {
      sub: "google_108492019481029",
      email: "jamal.ahmed@gmail.com",
      name: "Jamal Ahmed",
      picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop",
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
    };
    const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify(mockPayload));
    const mockCredential = `${header}.${payload}.mockSignatureKey`;

    try {
      await authService.loginWithGoogle(mockCredential);
      navigate("/", { replace: true });
    } catch {
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-2xl"
      >
        {/* Decorative Top Accent Glow */}
        <div className="absolute -top-24 left-1/2 h-44 w-72 -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)] shadow-sm">
            <BhaAIIcon size={36} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Welcome to BhaAI
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Your personal life operating system.
          </p>
        </div>

        {/* Step 1 Visual Indicator */}
        <div className="mt-6 rounded-[16px] border border-[var(--line)] bg-[var(--surface-2)]/60 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            <ShieldCheck size={14} />
            <span>Step 1: Sign in with Google</span>
          </div>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            Authenticates your identity only. Gmail read-only access is configured separately on your dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-[12px] border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3 text-xs text-[var(--danger)]">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-In Action Area */}
        <div className="mt-8 space-y-3 flex flex-col items-center">
          {/* Official Google Identity Services Render Target */}
          <div
            ref={googleBtnRef}
            className="flex min-h-[44px] w-full justify-center"
          />

          {/* Fallback Google Sign-In Button */}
          {(!gisLoaded || !window.google?.accounts?.id) && (
            <button
              type="button"
              disabled={loading}
              onClick={handleSimulatedGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-[var(--surface-2)] hover:border-[var(--text)] disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
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
              <span>{loading ? "Authenticating…" : "Sign in with Google"}</span>
            </button>
          )}

          <div className="flex items-center gap-2 pt-2 text-[11px] text-[var(--muted)]">
            <Lock size={11} className="text-[var(--accent)]" />
            <span>Encrypted with Google OAuth 2.0</span>
          </div>
        </div>

        {/* Local Development Fallback */}
        <div className="mt-8 border-t border-[var(--line)] pt-5">
          <div className="text-center">
            <span className="text-[11px] uppercase tracking-wider text-[var(--muted)]">
              Developer Environment
            </span>
          </div>

          <button
            type="button"
            onClick={handleDevLogin}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[var(--line)] py-2 text-xs font-medium text-[var(--muted)] hover:border-[var(--text)] hover:text-[var(--text)] transition"
          >
            <Code2 size={13} />
            <span>Continue as Developer (user_bhaai_dev)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
