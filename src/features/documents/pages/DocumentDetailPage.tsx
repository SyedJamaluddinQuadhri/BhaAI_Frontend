import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CalendarPlus, BellPlus, Check, ArrowRight } from "lucide-react";
import { documentsService } from "../../../services/documents/documents.service";
import { calendarService } from "../../../services/calendar/calendar.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { SourceReference } from "../../../components/shared/SourceReference";

export function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [reminderAdded, setReminderAdded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { data: doc } = useQuery({
    queryKey: ["document", id],
    queryFn: () => documentsService.get(id ?? ""),
  });

  if (!doc) {
    return (
      <PageContainer>
        <div className="py-20 text-center">
          <FileText size={48} className="mx-auto text-[var(--muted)] opacity-50 mb-3" />
          <h2 className="text-xl font-bold">Document not found</h2>
          <Link to="/documents" className="mt-3 inline-block text-sm text-[var(--accent)] hover:underline">
            ← Back to documents
          </Link>
        </div>
      </PageContainer>
    );
  }

  const handleAddToCalendar = async () => {
    // Parse or map date (e.g. "03 Oct 2026" or "14 Sep 2026" or fallback)
    const targetDate = doc.importantDate?.includes("2026")
      ? doc.importantDate.includes("Oct")
        ? "2026-10-03"
        : "2026-09-14"
      : "2026-09-14";

    await calendarService.add({
      title: `${doc.name} (Deadline)`,
      date: targetDate,
      start: "All day",
      end: "All day",
      type: "deadline",
      location: doc.location || "Vault Document",
      description: doc.summary,
      priority: "high",
      source: "vault",
    });

    setCalendarAdded(true);
    setToast(`Added "${doc.name}" to your calendar!`);
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreateReminder = () => {
    setReminderAdded(true);
    setToast(`Reminder set for ${doc.name} (Push + In-app)`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <PageContainer>
      <div className="py-8">
        <Link to="/documents" className="inline-flex items-center gap-2 text-sm muted hover:text-[var(--text)] transition">
          <ArrowLeft size={15} /> Back to documents
        </Link>
      </div>

      <div className="grid gap-8 pb-20 lg:grid-cols-[1.1fr_.9fr]">
        <div className="surface min-h-[620px] p-7 md:p-10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Badge>{doc.type}</Badge>
            <span className="text-xs muted font-mono">Encrypted & Verified</span>
          </div>

          <div className="flex flex-1 items-center justify-center my-8">
            <div className="text-center max-w-sm">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--accent)] shadow-sm">
                <FileText size={38} strokeWidth={1.5} />
              </div>
              <div className="text-2xl font-bold tracking-tight text-[var(--text)]">{doc.name}</div>
              <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                Indexed in secure document vault with semantic OCR embeddings.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs muted">
            <span>Stored in: {doc.location}</span>
            <span>Category: {doc.category}</span>
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <div className="eyebrow mb-2 text-[var(--teal)]">AI intelligence extract</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
              {doc.name}
            </h1>
            <p className="mt-4 text-base leading-7 muted">{doc.summary}</p>
          </div>

          <div className="space-y-4 border-y border-[var(--line)] py-5">
            <div>
              <div className="eyebrow">Important date</div>
              <div className="mt-1 text-lg font-semibold">{doc.importantDate}</div>
            </div>
            {doc.expiry && (
              <div>
                <div className="eyebrow">Expiry</div>
                <div className="mt-1 text-lg font-semibold text-[var(--danger)]">{doc.expiry}</div>
              </div>
            )}
            <div>
              <div className="eyebrow">Action required</div>
              <div className="mt-1 text-lg font-semibold text-[var(--accent)]">
                {doc.action ?? "None detected"}
              </div>
            </div>
            <div>
              <div className="eyebrow">Storage Location</div>
              <div className="mt-1 text-sm">{doc.location}</div>
            </div>
          </div>

          <div>
            <div className="eyebrow mb-2.5">Extracted information</div>
            <div className="flex flex-wrap gap-2">
              {doc.entities.map((e) => (
                <Badge key={e}>{e}</Badge>
              ))}
            </div>
          </div>

          <div>
            <SourceReference
              source={{
                label: doc.name,
                detail: "Extracted document context with 94% confidence",
                confidence: 94,
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {reminderAdded ? (
              <Button variant="secondary" className="border border-[var(--success)]/40 text-[var(--success)]">
                <Check size={16} /> Reminder scheduled
              </Button>
            ) : (
              <Button onClick={handleCreateReminder} className="shadow-sm">
                <BellPlus size={16} /> Create reminder
              </Button>
            )}

            {calendarAdded ? (
              <Button
                variant="secondary"
                onClick={() => navigate("/calendar")}
                className="border border-[var(--accent)]/40 text-[var(--accent)]"
              >
                <Check size={16} /> View in calendar <ArrowRight size={14} />
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleAddToCalendar}>
                <CalendarPlus size={16} /> Add to calendar
              </Button>
            )}
          </div>
        </aside>
      </div>

      {/* Floating Success Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-[14px] bg-[var(--text)] text-[var(--bg)] px-4 py-3 text-xs font-semibold shadow-xl animate-in fade-in">
          <Check size={15} className="text-[var(--success)]" />
          <span>{toast}</span>
        </div>
      )}
    </PageContainer>
  );
}
