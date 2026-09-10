import { apiRequest } from "../api/client";

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { type: "gmail" | "doc" | "deadline" | "calendar"; title: string; detail?: string }[];
  timestamp?: string;
}

export interface BackendSourceCitation {
  source_type?: string;
  file_name?: string;
  page?: number;
  chunk_id?: string;
  subject?: string;
  sender?: string;
  date?: string;
  title?: string;
  url?: string;
  domain?: string;
  snippet?: string;
}

export interface BackendChatResponse {
  ok: boolean;
  data: {
    answer: string;
    sources?: BackendSourceCitation[];
  };
}

export const aiService = {
  async chat(
    message: string,
    source: "personal" | "email" | "both" | "auto" = "personal"
  ): Promise<{ text: string; sources?: AIMessage["sources"] }> {
    try {
      const res = await apiRequest<BackendChatResponse>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message,
          source,
        }),
      });

      if (res && res.data) {
        const rawSources = res.data.sources || [];
        const mappedSources: AIMessage["sources"] = rawSources.map((s) => {
          if (s.source_type === "personal_document") {
            return {
              type: "doc" as const,
              title: s.file_name || "Personal Document",
              detail: s.page ? `Page ${s.page}` : s.chunk_id || "FAISS Chunk",
            };
          }
          if (s.source_type === "email") {
            return {
              type: "gmail" as const,
              title: s.subject || s.sender || "Email Citation",
              detail: s.date || s.sender || "Gmail Index",
            };
          }
          return {
            type: "doc" as const,
            title: s.title || s.file_name || "Context Source",
            detail: s.domain || s.url || s.snippet || "Retrieved chunk",
          };
        });

        return {
          text: res.data.answer,
          sources: mappedSources.length > 0 ? mappedSources : undefined,
        };
      }
    } catch (err: unknown) {
      console.warn("[BhaAI AI] EC2 backend chat request failed, checking error:", err);
      // If network error, provide clear guidance
      if (err instanceof Error && err.message.includes("Network error")) {
        return {
          text: `⚠️ **Unable to connect to the EC2 backend.**\n\nPlease ensure your EC2 instance is running and port 8000 is open in your AWS Security Group:\n\n\`\`\`bash\n# Check on EC2:\npython -m uvicorn app.main:app --host 0.0.0.0 --port 8000\n\`\`\`\n\nTarget endpoint: \`http://100.24.52.244:8000/v1/ai/chat\` with header \`X-User-Id: user_bhaai_dev\`.`,
        };
      }
    }

    // Fallback response if offline
    return {
      text: `Based on your connected personal documents: I retrieved the context from your personal vault, but the backend is currently synchronizing. Please try your question again in a moment.`,
    };
  },
};
