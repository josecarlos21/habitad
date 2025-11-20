
"use client";

import { initializeFirebase, FirebaseProvider } from ".";

// This provider ensures that Firebase is initialized only once on the client
// and shares the same instance across all children.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, auth, firestore } = initializeFirebase();
  return (
    <FirebaseProvider app={firebaseApp} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
