import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FileText, LoaderCircle, UploadCloud, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { documentsService } from "../../../services/documents/documents.service";

export function DocumentUpload({ onComplete }: { onComplete?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging,setDragging]=useState(false);
  const [file,setFile]=useState<File | null>(null);
  const [stage,setStage]=useState<"idle"|"processing"|"done">("idle");
  const [progress,setProgress]=useState(0);
  const [error,setError]=useState("");
  const choose=(selected:File|null)=>{if(!selected)return;setError("");if(!["application/pdf","image/jpeg","image/png","image/webp"].includes(selected.type)){setError("Upload a PDF, JPG, PNG or WebP file.");return;}if(selected.size>15*1024*1024){setError("Keep documents under 15 MB for this demo.");return;}setFile(selected);setStage("idle");};
  const process=async()=>{if(!file)return;setStage("processing");setProgress(8);for(const value of [24,46,68,84,100]){await new Promise(r=>setTimeout(r,350));setProgress(value);}await documentsService.upload(file);setStage("done");onComplete?.();};
  return <div className="surface overflow-hidden">
    <div className="p-6 md:p-8"><div className="eyebrow">Document intake</div><h2 className="mt-2 text-2xl font-semibold tracking-tight">Give BhaAI something to remember.</h2><p className="mt-2 max-w-xl text-sm leading-6 muted">Drop a PDF or image. BhaAI will classify it, extract dates and surface actions.</p></div>
    <div className="px-6 pb-6 md:px-8 md:pb-8"><input ref={inputRef} type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="hidden" onChange={e=>choose(e.target.files?.[0]??null)}/>
      <div onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);choose(e.dataTransfer.files?.[0]??null)}} className={`rounded-[18px] border border-dashed p-8 text-center transition ${dragging?"border-[var(--accent)] bg-[var(--accent-soft)]":"border-[var(--line)] bg-[var(--surface-2)]/60"}`}>
        {!file?<><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)]"><UploadCloud size={20}/></div><div className="mt-4 font-semibold">Drop your document here</div><div className="mt-1 text-xs muted">PDF, JPG, PNG or WebP · up to 15 MB</div><Button variant="secondary" className="mt-5" onClick={()=>inputRef.current?.click()}>Choose file</Button></>:<div className="flex items-center gap-4 text-left"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-[var(--surface)]"><FileText size={20}/></div><div className="min-w-0 flex-1"><div className="truncate font-semibold">{file.name}</div><div className="mt-1 text-xs muted">{(file.size/1024/1024).toFixed(2)} MB</div></div>{stage==="idle"&&<button aria-label="Remove file" onClick={()=>setFile(null)} className="muted"><X size={18}/></button>}{stage==="processing"&&<LoaderCircle size={20} className="animate-spin text-[var(--accent)]"/>}{stage==="done"&&<Check size={20} className="text-[var(--success)]"/>}</div>}
      </div>
      <AnimatePresence>{stage==="processing"&&<motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="mt-5"><div className="flex justify-between text-xs"><span>Reading → extracting → indexing</span><span>{progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]"><motion.div animate={{width:`${progress}%`}} className="h-full rounded-full bg-[var(--accent)]"/></div><div className="mt-3 text-xs muted">{progress<45?"Reading document…":progress<75?"Extracting information…":progress<95?"Checking dates and actions…":"Indexing for semantic search…"}</div></motion.div>}{stage==="done"&&<motion.div initial={{opacity:0}} animate={{opacity:1}} className="mt-5 rounded-[14px] bg-[#377a5212] p-4 text-sm"><strong>Ready.</strong> Your document is now part of the demo life memory.</motion.div>}</AnimatePresence>
      {error&&<div className="mt-4 text-sm text-[var(--danger)]">{error}</div>}
      {file&&stage==="idle"&&<Button onClick={process} className="mt-5 w-full">Process document <UploadCloud size={16}/></Button>}
    </div>
  </div>;
}
