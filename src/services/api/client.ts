export function getBaseUrl(): string {
  try {
    const custom = localStorage.getItem("bhaai_ec2_api_url");
    if (custom && custom.trim().length > 0) {
      return custom.trim().replace(/\/+$/, "");
    }
  } catch {
    // fallback
  }
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://100.24.52.244:8000/v1";
  return rawBaseUrl.replace(/\/+$/, "");
}

const baseUrl = getBaseUrl();

function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem("bhaai-session");
    return raw ? (JSON.parse(raw) as { accessToken?: string }).accessToken ?? null : null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  // Set default Content-Type for non-FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Set Auth Token if present
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set default X-User-Id for multi-tenant FAISS vector index isolation
  if (!headers.has("X-User-Id")) {
    const userId = localStorage.getItem("bhaai_user_id") || "user_bhaai_dev";
    headers.set("X-User-Id", userId);
  }

  // Ensure clean path join with single slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${getBaseUrl()}${cleanPath}`;

  try {
    const response = await fetch(fullUrl, { ...options, headers });

    if (response.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`API request to ${cleanPath} failed (${response.status}): ${errorText || response.statusText}`);
    }
    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TypeError" && err.message.includes("Failed to fetch")) {
      console.error(`[BhaAI API] Network error connecting to ${fullUrl}. Check EC2 security groups, CORS, and HTTP/HTTPS protocol.`);
    }
    throw err;
  }
}

export { baseUrl };
