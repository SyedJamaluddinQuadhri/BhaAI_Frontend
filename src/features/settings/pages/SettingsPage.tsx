import { useState } from "react";
import {
  Moon,
  Sun,
  GraduationCap,
  Briefcase,
  Server,
  Check,
  CheckCircle2,
  RefreshCw,
  Bell,
  Shield,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Button } from "../../../components/ui/Button";
import { useTheme } from "../../../hooks/useTheme";
import { getBaseUrl } from "../../../services/api/client";

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  // Mode Selection
  const [activeMode, setActiveMode] = useState<"student" | "professional">(() => {
    return (localStorage.getItem("bhaai_user_mode") as "student" | "professional") || "student";
  });

  // Notification toggles
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyCalendar, setNotifyCalendar] = useState(true);

  // EC2 Backend Gateway Configuration
  const [ec2Url, setEc2Url] = useState(() => {
    return localStorage.getItem("bhaai_ec2_api_url") || "";
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectMode = (mode: "student" | "professional") => {
    setActiveMode(mode);
    localStorage.setItem("bhaai_user_mode", mode);
    showToast(`Switched to ${mode === "student" ? "Student" : "Professional"} Mode!`);
  };

  const handleSaveEc2Url = async () => {
    const trimmed = ec2Url.trim();
    if (trimmed) {
      localStorage.setItem("bhaai_ec2_api_url", trimmed);
      setIsTesting(true);
      setTestResult(null);

      try {
        // Test connectivity
        const testEndpoint = trimmed.replace(/\/+$/, "");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        await fetch(`${testEndpoint}/health`, {
          method: "GET",
          signal: controller.signal,
          mode: "cors",
        }).catch(async () => {
          // If /health doesn't exist, try root
          return fetch(testEndpoint, {
            method: "GET",
            signal: controller.signal,
            mode: "cors",
          });
        });

        clearTimeout(timeoutId);
        setTestResult({
          success: true,
          message: "Connected! EC2 backend is reachable.",
        });
        showToast("EC2 API URL saved and active.");
      } catch (err) {
        setTestResult({
          success: false,
          message: "Saved URL, but endpoint did not respond. Check EC2 security groups and CORS.",
        });
        showToast("EC2 URL saved locally.");
      } finally {
        setIsTesting(false);
      }
    } else {
      localStorage.removeItem("bhaai_ec2_api_url");
      setTestResult(null);
      showToast("Reset to default API endpoint (/api).");
    }
  };

  const handleResetApiUrl = () => {
    localStorage.removeItem("bhaai_ec2_api_url");
    setEc2Url("");
    setTestResult(null);
    showToast("Reset API URL to default.");
  };

  return (
    <PageContainer>
      <Section eyebrow="Settings" title="Make BhaAI fit you.">
        <p className="max-w-2xl text-lg muted">
          Choose how your personal operating system should feel, what context matters most, and configure your backend gateway.
        </p>
      </Section>

      <div className="space-y-10 divide-y divide-[var(--line)]">
        {/* Appearance */}
        <div className="pt-2 grid gap-4 md:grid-cols-[1fr_auto] items-center">
          <div>
            <h3 className="font-semibold text-base">Appearance</h3>
            <p className="mt-1 text-sm muted">
              Switch between light and sleek dark mode. Currently using{" "}
              <span className="font-semibold capitalize text-[var(--text)]">{theme}</span> mode.
            </p>
          </div>
          <Button variant="secondary" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            Toggle theme
          </Button>
        </div>

        {/* Operating Persona / Mode Selection */}
        <div className="pt-8">
          <div>
            <h3 className="font-semibold text-base">Active Life Mode</h3>
            <p className="mt-1 text-sm muted">
              Tailors BhaAI's recommendations, priority sorting, and document extraction heuristics.
            </p>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Student Mode */}
            <div
              onClick={() => handleSelectMode("student")}
              className={`surface p-6 rounded-[20px] border cursor-pointer transition ${
                activeMode === "student"
                  ? "border-[var(--text)] ring-2 ring-[var(--accent-soft)]"
                  : "border-[var(--line)] hover:border-[var(--text)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--surface-2)] text-[var(--accent)]">
                  <GraduationCap size={22} />
                </div>
                {activeMode === "student" ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
                    <CheckCircle2 size={13} />
                    Active Mode
                  </span>
                ) : (
                  <span className="text-xs text-[var(--muted)] hover:text-[var(--text)]">
                    Click to activate
                  </span>
                )}
              </div>

              <h4 className="mt-4 text-lg font-semibold">Student Mode</h4>
              <p className="mt-2 text-sm leading-6 muted">
                Optimized for course assignments, exams, research projects, internships, campus placements, and scholarships.
              </p>

              <Button
                variant={activeMode === "student" ? "primary" : "secondary"}
                className="mt-5 w-full text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectMode("student");
                }}
              >
                {activeMode === "student" ? "Currently Active" : "Use Student Mode"}
              </Button>
            </div>

            {/* Professional Mode */}
            <div
              onClick={() => handleSelectMode("professional")}
              className={`surface p-6 rounded-[20px] border cursor-pointer transition ${
                activeMode === "professional"
                  ? "border-[var(--text)] ring-2 ring-[var(--accent-soft)]"
                  : "border-[var(--line)] hover:border-[var(--text)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--surface-2)] text-[var(--accent)]">
                  <Briefcase size={22} />
                </div>
                {activeMode === "professional" ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-semibold text-[var(--success)]">
                    <CheckCircle2 size={13} />
                    Active Mode
                  </span>
                ) : (
                  <span className="text-xs text-[var(--muted)] hover:text-[var(--text)]">
                    Click to activate
                  </span>
                )}
              </div>

              <h4 className="mt-4 text-lg font-semibold">Professional Mode</h4>
              <p className="mt-2 text-sm leading-6 muted">
                Prioritizes client meetings, key deliverables, contracts, vendor invoices, travel bookings, and certifications.
              </p>

              <Button
                variant={activeMode === "professional" ? "primary" : "secondary"}
                className="mt-5 w-full text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectMode("professional");
                }}
              >
                {activeMode === "professional" ? "Currently Active" : "Use Professional Mode"}
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-8">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Bell size={18} className="text-[var(--accent)]" />
            Nudge & Notification Channels
          </h3>
          <p className="mt-1 text-sm muted">
            Configure how and when BhaAI delivers deadline notices and life summaries.
          </p>

          <div className="mt-4 space-y-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--text)]">Push Notifications</div>
                <div className="text-xs muted">Immediate browser alerts for urgent same-day deadlines</div>
              </div>
              <input
                type="checkbox"
                checked={notifyPush}
                onChange={(e) => setNotifyPush(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[var(--line)] pt-3">
              <div>
                <div className="font-medium text-[var(--text)]">Daily Morning Email Digest</div>
                <div className="text-xs muted">Summary of the day's priority obligations at 8:00 AM</div>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[var(--line)] pt-3">
              <div>
                <div className="font-medium text-[var(--text)]">Calendar Sync Reminders</div>
                <div className="text-xs muted">Insert buffer events for document preparation</div>
              </div>
              <input
                type="checkbox"
                checked={notifyCalendar}
                onChange={(e) => setNotifyCalendar(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* EC2 Backend Gateway Setup */}
        <div className="pt-8 pb-10">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-[var(--accent)]" />
            <h3 className="font-semibold text-base">EC2 Backend Gateway</h3>
          </div>
          <p className="mt-1 text-sm muted">
            Link your live AWS EC2 instance backend. Enter the HTTP/HTTPS URL or Public IP of your EC2 server.
          </p>

          <div className="mt-4 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={ec2Url}
                onChange={(e) => setEc2Url(e.target.value)}
                placeholder="e.g. http://ec2-3-85-12-14.compute-1.amazonaws.com:8000"
                className="flex-1 rounded-[12px] border border-[var(--line)] bg-[var(--surface-2)] px-3.5 py-2.5 text-xs text-[var(--text)] outline-none font-mono placeholder:text-[var(--muted)]"
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  disabled={isTesting}
                  onClick={handleSaveEc2Url}
                  className="text-xs shrink-0"
                >
                  <RefreshCw size={13} className={`mr-1.5 ${isTesting ? "animate-spin" : ""}`} />
                  {isTesting ? "Testing..." : "Save & Test"}
                </Button>
                {ec2Url && (
                  <Button
                    variant="ghost"
                    onClick={handleResetApiUrl}
                    className="text-xs text-[var(--muted)] hover:text-[var(--text)]"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs muted">
              <span>
                Active Target:{" "}
                <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-[var(--text)]">
                  {getBaseUrl()}
                </code>
              </span>
              <span className="hidden sm:inline">CORS enabled backend required</span>
            </div>

            {testResult && (
              <div
                className={`mt-3 rounded-[10px] p-2.5 text-xs flex items-center gap-2 ${
                  testResult.success
                    ? "bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--danger-soft)] text-[var(--danger)]"
                }`}
              >
                {testResult.success ? <CheckCircle2 size={15} /> : <Shield size={15} />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

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
