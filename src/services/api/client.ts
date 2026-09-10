const rawBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
// Strip trailing slash if present
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

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

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure clean path join with single slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${baseUrl}${cleanPath}`;

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
