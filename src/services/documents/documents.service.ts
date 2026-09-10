import { mockDocuments } from "../../mock/documents";
import type { Document } from "../../types/common";
import { apiRequest } from "../api/client";

export const documentsService = {
  async list(): Promise<Document[]> { await new Promise((resolve) => setTimeout(resolve, 180)); return mockDocuments; },
  async get(id: string): Promise<Document | undefined> { return mockDocuments.find((doc) => doc.id === id); },
  async upload(file: File): Promise<{ id: string; name: string; status: string }> {
    if ((import.meta.env.VITE_USE_MOCKS ?? "true") === "true") {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return { id: crypto.randomUUID(), name: file.name, status: "processed" };
    }
    const form = new FormData(); form.append("file", file);
    return apiRequest<{ id: string; name: string; status: string }>("/documents/upload", { method: "POST", body: form, headers: {} });
  },
};
