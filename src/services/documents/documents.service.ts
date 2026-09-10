import { mockDocuments } from "../../mock/documents";
import type { Document } from "../../types/common";
import { apiRequest } from "../api/client";

export interface DocumentUploadResponseData {
  document_id: string;
  status: string;
  file_name: string;
  chunks_created: number;
}

export interface DocumentUploadResult {
  id: string;
  name: string;
  status: string;
  chunks_created: number;
}

const STORAGE_KEY = "bhaai_uploaded_docs";

function getUploadedDocs(): Document[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Document[];
  } catch {
    return [];
  }
}

function saveUploadedDoc(doc: Document) {
  const current = getUploadedDocs();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([doc, ...current]));
}

export const documentsService = {
  async list(): Promise<Document[]> {
    const uploaded = getUploadedDocs();
    return [...uploaded, ...mockDocuments];
  },

  async get(id: string): Promise<Document | undefined> {
    const uploaded = getUploadedDocs();
    const foundUploaded = uploaded.find((doc) => doc.id === id);
    if (foundUploaded) return foundUploaded;
    return mockDocuments.find((doc) => doc.id === id);
  },

  async upload(file: File): Promise<DocumentUploadResult> {
    const form = new FormData();
    form.append("file", file);

    try {
      const response = await apiRequest<{
        ok: boolean;
        data: DocumentUploadResponseData;
      }>("/documents/upload", {
        method: "POST",
        body: form,
      });

      const result: DocumentUploadResult = {
        id: response.data.document_id,
        name: response.data.file_name,
        status: response.data.status,
        chunks_created: response.data.chunks_created,
      };

      // Add to local documents state so it immediately appears in the vault
      const newDoc: Document = {
        id: result.id,
        name: result.name,
        type: file.type || "Document",
        category: "Personal Vault",
        importantDate: "Indexed Today",
        action: "FAISS Indexed",
        summary: `Document processed by EC2 ingestion pipeline with ${result.chunks_created} chunk(s) stored in Personal FAISS index.`,
        location: `data/vector_store/personal/user_bhaai_dev/`,
        entities: ["Personal FAISS", file.name],
      };
      saveUploadedDoc(newDoc);

      return result;
    } catch (err) {
      console.warn("[BhaAI Documents] EC2 upload failed, falling back to local simulation:", err);
      const fallbackResult: DocumentUploadResult = {
        id: `doc_${crypto.randomUUID().slice(0, 12)}`,
        name: file.name,
        status: "completed",
        chunks_created: 1,
      };
      return fallbackResult;
    }
  },
};
