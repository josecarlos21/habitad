"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/lib/types";
import { user as mockUser } from "@/lib/mocks";

type SessionStatus = "checking" | "unauthenticated" | "authenticated" | "pending";
type AuthChannel = "email" | "sms";

export interface AuthChallenge {
  id: string;
  identifier: string;
  maskedIdentifier: string;
  channel: AuthChannel;
  createdAt: string;
  expiresAt: string;
}

interface SessionSnapshot {
  status: SessionStatus;
  user: User | null;
  challenge: AuthChallenge | null;
  lastLogin?: string;
  pendingMessage?: string;
}

interface SessionContextValue {
  session: SessionSnapshot;
  initiateLogin: (identifier: string) => Promise<AuthChallenge>;
  confirmLogin: (challengeId: string, code: string) => Promise<void>;
  logout: () => void;
  registerResident: (payload: RegistrationPayload) => Promise<RegistrationResult>;
  clearChallenge: () => void;
}

interface PersistedSession {
  status: Exclude<SessionStatus, "checking">;
  user?: User | null;
  lastLogin?: string;
  pendingMessage?: string;
}

const SESSION_STORAGE_KEY = "habitad_session_v1";

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export type RegistrationPayload = {
  name: string;
  email: string;
  phone?: string;
  unitCode: string;
};

export type RegistrationResult = {
  requestId: string;
  status: "pending_review" | "auto_approved";
  estimatedResponseMinutes: number;
};

const maskIdentifier = (value: string) => {
  if (!value) return "";
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    const visible = name.slice(0, 2);
    return `${visible}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
  }
  return `${value.slice(0, 3)}****${value.slice(-2)}`;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionSnapshot>({
    status: "checking",
    user: null,
    challenge: null,
  });

  const persistSession = useCallback((snapshot: SessionSnapshot) => {
    const payload: PersistedSession = {
      status: snapshot.status === "checking" ? "unauthenticated" : snapshot.status,
      user: snapshot.user,
      lastLogin: snapshot.lastLogin,
      pendingMessage: snapshot.pendingMessage,
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      await delay(500);
      const cached =
        typeof window !== "undefined"
          ? window.localStorage.getItem(SESSION_STORAGE_KEY)
          : null;
      if (!isMounted) return;
      if (cached) {
        try {
          const parsed: PersistedSession = JSON.parse(cached);
          setSession((prev) => ({
            ...prev,
            status: parsed.status,
            user: parsed.user ?? null,
            challenge: null,
            lastLogin: parsed.lastLogin,
            pendingMessage: parsed.pendingMessage,
          }));
          return;
        } catch (error) {
          console.warn("Failed to parse session cache", error);
        }
      }
      setSession((prev) => ({
        ...prev,
        status: "unauthenticated",
        user: null,
        challenge: null,
      }));
    };
    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  const initiateLogin = useCallback(async (identifier: string) => {
    await delay(800);
    const challenge: AuthChallenge = {
      id: `otp-${Date.now()}`,
      identifier,
      maskedIdentifier: maskIdentifier(identifier),
      channel: identifier.includes("@") ? "email" : "sms",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
    setSession((prev) => ({
      ...prev,
      status: "unauthenticated",
      challenge,
      user: null,
    }));
    return challenge;
  }, []);

  const confirmLogin = useCallback(
    async (challengeId: string, code: string) => {
      await delay(600);
      if (!session.challenge || session.challenge.id !== challengeId) {
        throw new Error("No encontramos tu solicitud de acceso.");
      }
      if (code.trim() !== "123456") {
        throw new Error("El código ingresado es incorrecto.");
      }
      const snapshot: SessionSnapshot = {
        status: "authenticated",
        user: mockUser,
        challenge: null,
        lastLogin: new Date().toISOString(),
      };
      setSession(snapshot);
      persistSession(snapshot);
    },
    [session.challenge, persistSession]
  );

  const logout = useCallback(() => {
    const snapshot: SessionSnapshot = {
      status: "unauthenticated",
      user: null,
      challenge: null,
    };
    setSession(snapshot);
    persistSession(snapshot);
  }, [persistSession]);

  const registerResident = useCallback(
    async (payload: RegistrationPayload): Promise<RegistrationResult> => {
      await delay(900);
      const result: RegistrationResult = {
        requestId: `reg-${Date.now()}`,
        status: "pending_review",
        estimatedResponseMinutes: 45,
      };
      const snapshot: SessionSnapshot = {
        status: "pending",
        user: null,
        challenge: null,
        pendingMessage: `Hemos recibido tu registro para la unidad ${payload.unitCode}. Te notificaremos en breve.`,
      };
      setSession(snapshot);
      persistSession(snapshot);
      return result;
    },
    [persistSession]
  );

  const clearChallenge = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      challenge: null,
    }));
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      initiateLogin,
      confirmLogin,
      logout,
      registerResident,
      clearChallenge,
    }),
    [session, initiateLogin, confirmLogin, logout, registerResident, clearChallenge]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession debe usarse dentro de SessionProvider.");
  }
  return context;
}
