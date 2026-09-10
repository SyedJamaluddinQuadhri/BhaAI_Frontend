import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plug,
  Check,
  RefreshCw,
  Shield,
  ExternalLink,
  Trash2,
  Lock,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { integrationsService, type Integration } from "../../../services/integrations/integrations.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export function IntegrationsPage() {
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["integrations"],
    queryFn: integrationsService.list,
  });

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [authorizingIntegration, setAuthorizingIntegration] = useState<Integration | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSync = async (id: string) => {
    setIsSyncing(true);
    await integrationsService.syncNow(id);
    setIsSyncing(false);
    showToast("Integration synced successfully!");
    queryClient.invalidateQueries({ queryKey: ["integrations"] });
    if (selectedIntegration?.id === id) {
      setSelectedIntegration((prev) => prev ? { ...prev, lastSync: "Just now" } : null);
    }
  };

  const handleToggleDisconnect = async (id: string) => {
    await integrationsService.toggleConnect(id);
    queryClient.invalidateQueries({ queryKey: ["integrations"] });
    setSelectedIntegration(null);
    showToast("Integration disconnected.");
  };

  const handleAuthorize = async () => {
    if (!authorizingIntegration) return;
    await integrationsService.toggleConnect(authorizingIntegration.id);
    queryClient.invalidateQueries({ queryKey: ["integrations"] });
    showToast(`Successfully connected ${authorizingIntegration.name}!`);
    setAuthorizingIntegration(null);
  };

  return (
    <PageContainer>
      <Section eyebrow="Connections" title="Let BhaAI understand your world.">
        <p className="max-w-2xl text-lg muted">
          Connect only what you want. Permissions are explicit, bounded by privacy guardrails, and can be revoked at any time.
        </p>
      </Section>

      <div className="grid gap-5 md:grid-cols-2">
        {data.map((i) => (
          <div
            key={i.id}
            className="surface p-6 rounded-[20px] border border-[var(--line)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[var(--surface-2)] text-[var(--accent)]">
                    <Plug size={19} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{i.name}</h3>
                    <div className="mt-1 text-xs muted">
                      {i.provider} · Last sync {i.lastSync}
                    </div>
                  </div>
                </div>
                <Badge tone={i.connected ? "success" : "neutral"}>
                  {i.connected ? "Connected" : "Disconnected"}
                </Badge>
              </div>

              {i.description && (
                <p className="mt-3 text-xs leading-5 muted">{i.description}</p>
              )}

              <div className="mt-6 border-t border-[var(--line)] pt-5">
                <div className="eyebrow mb-3">Permissions</div>
                {i.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-2 py-1 text-xs muted">
                    <Check size={13} className="text-[var(--success)]" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant={i.connected ? "secondary" : "primary"}
              className="mt-6 w-full"
              onClick={() => {
                if (i.connected) {
                  setSelectedIntegration(i);
                } else {
                  setAuthorizingIntegration(i);
                }
              }}
            >
              {i.connected ? "View permissions & sync" : "Connect account"}
            </Button>
          </div>
        ))}
      </div>

      {/* View Permissions & Sync Modal */}
      <AnimatePresence>
        {selectedIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIntegration(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-[var(--accent)]" />
                  <h3 className="font-semibold text-base">{selectedIntegration.name} Integration</h3>
                </div>
                <button
                  onClick={() => setSelectedIntegration(null)}
                  className="text-xs muted hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-[12px] bg-[var(--surface-2)] p-3 text-xs">
                  <div className="flex items-center justify-between font-medium">
                    <span>Status:</span>
                    <span className="text-[var(--success)] flex items-center gap-1 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                      Active & Connected
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between muted">
                    <span>Last sync:</span>
                    <span>{selectedIntegration.lastSync}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold mb-2 muted">Granted OAuth Scopes</div>
                  <div className="space-y-1.5">
                    {selectedIntegration.scopes?.map((s) => (
                      <div
                        key={s}
                        className="flex items-center gap-2 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 text-[11px] font-mono muted"
                      >
                        <Lock size={11} className="text-[var(--accent)] shrink-0" />
                        <span className="truncate">{s}</span>
                      </div>
                    )) ??
                      selectedIntegration.permissions.map((p) => (
                        <div
                          key={p}
                          className="flex items-center gap-2 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 text-xs muted"
                        >
                          <Check size={12} className="text-[var(--success)]" />
                          <span>{p}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="rounded-[12px] border border-[var(--line)] p-3 text-xs muted">
                  <div className="font-semibold text-[var(--text)] mb-1 flex items-center gap-1.5">
                    <Zap size={13} className="text-[var(--accent)]" />
                    Data Handling Notice
                  </div>
                  BhaAI extracts and stores only structured action metadata (dates, vendors, deadlines). Full email bodies are never fed into external foundation models without consent.
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[var(--line)]">
                <Button
                  variant="danger"
                  className="text-xs"
                  onClick={() => handleToggleDisconnect(selectedIntegration.id)}
                >
                  <Trash2 size={13} className="mr-1" />
                  Disconnect
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={isSyncing}
                    onClick={() => handleSync(selectedIntegration.id)}
                  >
                    <RefreshCw size={13} className={`mr-1.5 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Syncing…" : "Sync Now"}
                  </Button>
                  <Button variant="primary" onClick={() => setSelectedIntegration(null)}>
                    Done
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Authorize Integration Modal */}
      <AnimatePresence>
        {authorizingIntegration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthorizingIntegration(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
                <h3 className="font-semibold text-base">Connect {authorizingIntegration.name}</h3>
                <button
                  onClick={() => setAuthorizingIntegration(null)}
                  className="text-xs muted hover:text-[var(--text)]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent)] mb-3">
                  <Plug size={28} />
                </div>
                <h4 className="font-semibold text-base text-[var(--text)]">
                  Authorize BhaAI to connect with {authorizingIntegration.provider}
                </h4>
                <p className="mt-2 text-xs leading-5 muted">
                  BhaAI will request read-only access to synchronize important dates and notifications. You can revoke access anytime.
                </p>
              </div>

              <div className="mt-5 space-y-2 rounded-[12px] bg-[var(--surface-2)] p-3 text-xs">
                <div className="font-semibold text-[var(--text)] mb-1">Requested Permissions:</div>
                {authorizingIntegration.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-2 muted">
                    <Check size={12} className="text-[var(--success)]" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-[var(--line)]">
                <Button variant="secondary" onClick={() => setAuthorizingIntegration(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleAuthorize}>
                  Authorize & Connect
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
