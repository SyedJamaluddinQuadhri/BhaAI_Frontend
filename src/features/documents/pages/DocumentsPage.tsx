import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageContainer } from "../../../components/layout/PageContainer";
import { Section } from "../../../components/shared/Section";
import { DocumentArchive } from "../components/DocumentArchive";
import { DocumentUpload } from "../components/DocumentUpload";
import { LoadingState } from "../../../components/shared/LoadingState";

export function DocumentsPage(){
  const client=useQueryClient();
  const {data,isPending}=useQuery({queryKey:["documents"],queryFn:()=>import("../../../services/documents/documents.service").then(m=>m.documentsService.list())});
  return <PageContainer><Section eyebrow="Document intelligence" title="Everything important, remembered."><p className="max-w-2xl text-lg leading-8 muted">Don’t remember filenames. Remember what you need. BhaAI connects documents to dates, actions, emails and tasks.</p></Section><div className="mb-10"><DocumentUpload onComplete={()=>client.invalidateQueries({queryKey:["documents"]})}/></div>{isPending?<LoadingState/>:<DocumentArchive documents={data??[]}/>}</PageContainer>;
}
