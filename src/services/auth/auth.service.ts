import { apiRequest } from "../api/client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  twoFactorEnabled?: boolean;
  googleAuthenticatorVerified?: boolean;
  googleAuthSecret?: string;
  gmailGatewayConnected?: boolean;
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
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

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

export interface AuthApiContract {
  login: (email: string, password: string, totpCode?: string) => Promise<Session>;
  signup: (name: string, email: string, password: string) => Promise<Session>;
}

const useMocks = (import.meta.env.VITE_USE_MOCKS ?? "true") === "true";

export const authService = {
  getSession(): Session | null {
    return readSession();
  },

  generateGoogleAuthSecret(email: string) {
    const secret = "BHAAI-4928-JBSW-Y3DP";
    const cleanEmail = encodeURIComponent(email || "user@bhaai.local");
    const otpauthUrl = `otpauth://totp/BhaAI:${cleanEmail}?secret=${secret.replace(/-/g, "")}&issuer=BhaAI`;
    return { secret, otpauthUrl };
  },

  async verifyGoogleAuthCode(code: string): Promise<boolean> {
    await delay(300);
    const cleaned = code.trim().replace(/\s+/g, "");
    // Accept valid 6-digit codes (e.g. 123456 or any 6 digits for testing)
    return /^\d{6}$/.test(cleaned);
  },

  async connectGmailGateway(accountEmail: string): Promise<{ success: boolean; syncedCount: number }> {
    await delay(600);
    const current = readSession();
    if (current) {
      current.user.gmailGatewayConnected = true;
      current.user.gmailAddress = accountEmail;
      current.user.gmailLastSync = "Just now";
      current.user.syncedEmailsCount = 4;
      localStorage.setItem(KEY, JSON.stringify(current));
    }
    return { success: true, syncedCount: 4 };
  },

  async login(email: string, password: string, totpCode?: string): Promise<Session> {
    if (!useMocks) {
      const result = await apiRequest<Session>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, totpCode }),
      });
      localStorage.setItem(KEY, JSON.stringify(result));
      return result;
    }
    await delay(450);
    const session: Session = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      expiresAt: Date.now() + 86_400_000,
      user: {
        id: "u_01",
        name: email.split("@")[0] || "Jamal",
        email,
        twoFactorEnabled: true,
        googleAuthenticatorVerified: true,
        gmailGatewayConnected: true,
        gmailAddress: email,
        gmailLastSync: "1 min ago",
        syncedEmailsCount: 4,
      },
    };
    localStorage.setItem(KEY, JSON.stringify(session));
    return session;
  },

  async signup(
    name: string,
    email: string,
    password: string,
    options?: {
      twoFactorEnabled?: boolean;
      googleAuthSecret?: string;
      gmailConnected?: boolean;
      gmailAddress?: string;
    }
  ): Promise<Session> {
    if (!useMocks) {
      const result = await apiRequest<Session>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password, ...options }),
      });
      localStorage.setItem(KEY, JSON.stringify(result));
      return result;
    }
    await delay(550);
    const session: Session = {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      expiresAt: Date.now() + 86_400_000,
      user: {
        id: crypto.randomUUID(),
        name,
        email,
        twoFactorEnabled: options?.twoFactorEnabled ?? true,
        googleAuthenticatorVerified: options?.twoFactorEnabled ?? true,
        googleAuthSecret: options?.googleAuthSecret ?? "BHAAI-4928-JBSW-Y3DP",
        gmailGatewayConnected: options?.gmailConnected ?? true,
        gmailAddress: options?.gmailAddress ?? email,
        gmailLastSync: "Just now",
        syncedEmailsCount: 4,
      },
    };
    localStorage.setItem(KEY, JSON.stringify(session));
    return session;
  },

  async updateSessionUser(updates: Partial<SessionUser>): Promise<Session | null> {
    const current = readSession();
    if (!current) return null;
    current.user = { ...current.user, ...updates };
    localStorage.setItem(KEY, JSON.stringify(current));
    return current;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(KEY);
  },
};
