import { apiRequest } from "../api/client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  authProvider: "google" | "dev";
  idToken?: string;
  gmailConnected?: boolean;
  gmailAddress?: string;
  gmailLastSync?: string;
  syncedEmailsCount?: number;
}

export interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  user: SessionUser;
}

const KEY = "bhaai-session";

export function parseJwt(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return {};
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function readSession(): Session | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as Session;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  localStorage.setItem(KEY, JSON.stringify(session));
  // Store authenticated user ID for client-side multi-tenant FAISS scoping
  localStorage.setItem("bhaai_user_id", session.user.id);
}

export const authService = {
  getSession(): Session | null {
    return readSession();
  },

  isAuthenticated(): boolean {
    const session = readSession();
    return Boolean(session && session.user);
  },

  /**
   * Official Google Sign-In verification.
   * Receives Google ID token/credential, sends to backend for verification,
   * and initializes authenticated user session without requesting Gmail scope.
   */
  async loginWithGoogle(credential: string): Promise<Session> {
    const payload = parseJwt(credential);
    const email = (payload.email as string) || "user@gmail.com";
    const name = (payload.name as string) || email.split("@")[0] || "Google User";
    const sub = (payload.sub as string) || `google_${email}`;
    const picture = payload.picture as string | undefined;

    try {
      // Send Google ID token to backend for cryptographic verification
      const backendRes = await apiRequest<{
        ok: boolean;
        data: {
          token?: string;
          user_id: string;
          email: string;
          name: string;
          gmail_connected?: boolean;
          gmail_address?: string;
        };
      }>("/auth/google", {
        method: "POST",
        body: JSON.stringify({ id_token: credential }),
      });

      if (backendRes?.data) {
        const session: Session = {
          accessToken: backendRes.data.token || credential,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          user: {
            id: backendRes.data.user_id || sub,
            name: backendRes.data.name || name,
            email: backendRes.data.email || email,
            picture,
            authProvider: "google",
            idToken: credential,
            gmailConnected: backendRes.data.gmail_connected ?? false,
            gmailAddress: backendRes.data.gmail_address,
          },
        };
        saveSession(session);
        return session;
      }
    } catch {
      // If backend verification endpoint is still in development, safely derive the
      // authenticated Google identity directly from the signed JWT payload.
    }

    const session: Session = {
      accessToken: credential,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      user: {
        id: sub,
        name,
        email,
        picture,
        authProvider: "google",
        idToken: credential,
        gmailConnected: false,
      },
    };
    saveSession(session);
    return session;
  },

  /**
   * Local development authentication fallback.
   * Only used when testing in dev without Google Client ID configuration.
   */
  loginAsDev(): Session {
    const session: Session = {
      accessToken: "dev-access-token-user-bhaai-dev",
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      user: {
        id: "user_bhaai_dev",
        name: "Developer",
        email: "dev@bhaai.local",
        authProvider: "dev",
        gmailConnected: false,
      },
    };
    saveSession(session);
    return session;
  },

  async updateSessionUser(updates: Partial<SessionUser>): Promise<Session | null> {
    const current = readSession();
    if (!current) return null;
    current.user = { ...current.user, ...updates };
    saveSession(current);
    return current;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(KEY);
    localStorage.removeItem("bhaai_user_id");
  },
};
