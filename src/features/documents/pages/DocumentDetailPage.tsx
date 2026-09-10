import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, CalendarPlus, BellPlus } from "lucide-react";
import { documentsService } from "../../../services/documents/documents.service";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { SourceReference } from "../../../components/shared/SourceReference";

export function DocumentDetailPage() {
  const { id } = useParams();
  const { data: doc } = useQuery({ queryKey: ["document", id], queryFn: () => documentsService.get(id ?? "") });
  if (!doc) return <PageContainer><div className="py-20">Document not found.</div></PageContainer>;

  return <PageContainer>
    <div className="py-8"><Link to="/documents" className="inline-flex items-center gap-2 text-sm muted"><ArrowLeft size={15}/>Back to documents</Link></div>
    <div className="grid gap-8 pb-20 lg:grid-cols-[1.1fr_.9fr]">
      <div className="surface min-h-[620px] p-7 md:p-10">
        <div className="flex items-center justify-between"><Badge>{doc.type}</Badge><span className="text-xs muted">Preview</span></div>
        <div className="flex h-[500px] items-center justify-center"><div className="text-center"><FileText size={54} strokeWidth={1.2} className="mx-auto mb-5 muted"/><div className="text-2xl font-semibold">{doc.name}</div><p className="mt-2 text-sm muted">Secure document preview placeholder</p></div></div>
      </div>
      <aside>
        <div className="eyebrow mb-3">AI intelligence</div>
        <h1 className="page-title text-5xl">{doc.name}</h1>
        <p className="mt-6 text-base leading-7 muted">{doc.summary}</p>
        <div className="my-8 space-y-5 border-y border-[var(--line)] py-6">
          <div><div className="eyebrow">Important date</div><div className="mt-1 text-xl font-semibold">{doc.importantDate}</div></div>
          {doc.expiry && <div><div className="eyebrow">Expiry</div><div className="mt-1 text-xl font-semibold">{doc.expiry}</div></div>}
          <div><div className="eyebrow">Action required</div><div className="mt-1 text-xl font-semibold">{doc.action ?? "None detected"}</div></div>
          <div><div className="eyebrow">Location</div><div className="mt-1 text-sm">{doc.location}</div></div>
        </div>
        <div className="eyebrow mb-3">Extracted information</div>
        <div className="flex flex-wrap gap-2">{doc.entities.map(e => <Badge key={e}>{e}</Badge>)}</div>
        <div className="mt-7"><SourceReference source={{ label: doc.name, detail: "Extracted document context", confidence: 94 }}/></div>
        <div className="mt-7 flex flex-wrap gap-2"><Button><BellPlus size={16}/>Create reminder</Button><Button variant="secondary"><CalendarPlus size={16}/>Add to calendar</Button></div>
      </aside>
    </div>
  </PageContainer>;
}
