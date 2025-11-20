
"use client";

import { createContext, useContext } from "react";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { useUser as useAuthUserHook } from "./auth/use-user";

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({
  children,
  ...value
}: React.PropsWithChildren<FirebaseContextValue>) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export function useFirebaseApp() {
  const context = useFirebase();
  return context?.app;
}

export function useAuth() {
  const context = useFirebase();
  return context?.auth;
}

export function useFirestore() {
  const context = useFirebase();
  return context?.firestore;
}

export function useUser() {
    const auth = useAuth();
    return useAuthUserHook(auth);
}
