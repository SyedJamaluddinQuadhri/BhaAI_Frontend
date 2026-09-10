import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  FileText,
  LoaderCircle,
  UploadCloud,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
  Database,
  ArrowRight,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { documentsService, type DocumentUploadResult } from "../../../services/documents/documents.service";

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".xlsx", ".txt", ".jpg", ".jpeg", ".png", ".webp"];

export function DocumentUpload({ onComplete }: { onComplete?: () => void }) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<"idle" | "scanning" | "done">("idle");
  const [scanMessage, setScanMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<DocumentUploadResult | null>(null);
  const [error, setError] = useState("");

  const choose = (selected: File | null) => {
    if (!selected) return;
    setError("");

    const name = selected.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));

    if (!hasValidExt && !selected.type) {
      setError("Please upload a PDF, DOCX, XLSX, TXT, JPG, PNG or WebP file.");
      return;
    }

    if (selected.size > 25 * 1024 * 1024) {
      setError("Keep documents under 25 MB.");
      return;
    }

    setFile(selected);
    setStage("idle");
    setUploadResult(null);
  };

  const processWithLaserScan = async () => {
    if (!file) return;
    setStage("scanning");
    setError("");
    setProgress(15);
    setScanMessage("Extracting text and structure from document…");

    try {
      // Optical scan & extraction animation
      await new Promise((r) => setTimeout(r, 400));
      setProgress(45);
      setScanMessage("Normalizing whitespace & splitting into semantic chunks…");

      await new Promise((r) => setTimeout(r, 450));
      setProgress(75);
      setScanMessage("Generating all-MiniLM-L6-v2 embeddings & indexing into Personal FAISS…");

      // Actual EC2 backend upload
      const result = await documentsService.upload(file);

      setProgress(100);
      setScanMessage("Indexed into Personal FAISS vector index.");
      setUploadResult(result);
      setStage("done");
      onComplete?.();
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload document to EC2 backend.");
      setStage("idle");
    }
  };

  const handleReset = () => {
    setFile(null);
    setStage("idle");
    setUploadResult(null);
    setError("");
  };

  return (
    <div className="surface overflow-hidden rounded-[24px] border border-[var(--line)]">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--teal)]">
          <Sparkles size={14} />
          <span>Real-time Document Intake & EC2 FAISS Indexer</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Give BhaAI something to remember.
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-6 muted">
          Drop a real PDF, DOCX, XLSX, or TXT file. The EC2 backend extracts, chunks, and stores its embeddings directly into your Personal FAISS index (<code className="text-[11px] font-mono">data/vector_store/personal/user_bhaai_dev/</code>).
        </p>
      </div>

      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => choose(e.target.files?.[0] ?? null)}
        />

        {/* Interactive Drop Zone with Glowing Halo */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            choose(e.dataTransfer.files?.[0] ?? null);
          }}
          className={`relative overflow-hidden rounded-[20px] border-2 border-dashed p-8 text-center transition duration-200 ${
            dragging
              ? "border-[var(--accent)] bg-[var(--accent-soft)] ring-4 ring-[var(--accent)]/20 scale-[1.01]"
              : "border-[var(--line)] bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)]/80"
          }`}
        >
          {!file ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface)] shadow-sm text-[var(--accent)]">
                <UploadCloud size={24} />
              </div>
              <div className="mt-4 font-semibold text-sm sm:text-base">
                Drop your PDF, DOCX, XLSX, or TXT here
              </div>
              <div className="mt-1 text-xs muted">
                Directly connects to EC2 backend · FAISS Indexing with sub-second retrieval
              </div>
              <Button
                variant="secondary"
                className="mt-5 text-xs shadow-sm"
                onClick={() => inputRef.current?.click()}
              >
                Choose file from computer
              </Button>
            </>
          ) : (
            <div className="relative">
              {/* Document Preview Card */}
              <div className="relative overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-5 text-left shadow-sm">
                {/* Visual AI Laser Scan Line during scanning */}
                {stage === "scanning" && (
                  <motion.div
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-x-0 z-20 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent shadow-[0_0_15px_var(--accent)] pointer-events-none"
                  />
                )}

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-[var(--accent-soft)] text-[var(--accent)]">
                      <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-sm">{file.name}</div>
                      <div className="text-xs muted mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Target: user_bhaai_dev Personal Index
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {stage === "idle" && (
                      <button
                        aria-label="Remove file"
                        onClick={handleReset}
                        className="rounded-full p-1.5 text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition"
                      >
                        <X size={18} />
                      </button>
                    )}
                    {stage === "scanning" && (
                      <LoaderCircle size={20} className="animate-spin text-[var(--accent)]" />
                    )}
                    {stage === "done" && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--success)] text-white">
                        <Check size={16} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Real-time Extracted Metadata Chips */}
                {uploadResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex flex-wrap gap-2 border-t border-[var(--line)] pt-3 text-xs"
                  >
                    <span className="flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-2.5 py-1 font-medium text-[var(--text)]">
                      <Database size={13} className="text-[var(--teal)]" />
                      ID: {uploadResult.id}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-[var(--surface-2)] px-2.5 py-1 font-medium text-[var(--text)]">
                      <Layers size={13} className="text-[var(--accent)]" />
                      {uploadResult.chunks_created} Chunk(s) in FAISS
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-2.5 py-1 font-medium text-[var(--success)]">
                      <Check size={13} />
                      Status: {uploadResult.status}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Scan Progress Bar & Stage Messages */}
        <AnimatePresence>
          {stage === "scanning" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[var(--accent)]">
                  <Sparkles size={13} className="animate-spin" />
                  EC2 Ingestion Pipeline Active…
                </span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--teal)]"
                />
              </div>
              <div className="text-xs text-[var(--muted)]">{scanMessage}</div>
            </motion.div>
          )}

          {stage === "done" && file && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 rounded-[16px] border border-[var(--success)]/30 bg-[var(--success)]/10 p-5 text-xs text-[var(--success)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-medium"
            >
              <div className="flex items-center gap-2">
                <Check size={18} className="shrink-0" />
                <span>
                  <strong>Document successfully embedded.</strong> Ready for immediate questions via Groq RAG.
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="text-xs"
                  onClick={handleReset}
                >
                  Upload another
                </Button>
                <Button
                  variant="primary"
                  className="text-xs"
                  onClick={() =>
                    navigate(
                      `/assistant?q=${encodeURIComponent(
                        `What are the key details and summary of ${file.name}?`
                      )}`
                    )
                  }
                >
                  Ask BhaAI about this <ArrowRight size={13} className="ml-1" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <div className="mt-3 text-xs text-[var(--danger)] font-medium">{error}</div>}

        {file && stage === "idle" && (
          <Button onClick={processWithLaserScan} className="mt-4 w-full py-3">
            <Sparkles size={16} className="mr-1.5" />
            Upload & Ingest to EC2 FAISS
          </Button>
        )}
      </div>
    </div>
  );
}
