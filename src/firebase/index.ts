
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

import { useCollection } from "./firestore/use-collection";
import { useDoc } from "./firestore/use-doc";
import { useUser as useAuthUserHook } from "./auth/use-user";
import {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useAuth as useAuthContext,
  useFirestore as useFirestoreContext,
} from "./provider";

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This is a server-safe and client-safe way to initialize Firebase.
function initializeFirebase() {
  if (typeof window === "undefined") {
    // On the server, we can get away with just creating a new instance every time,
    // or reusing the existing one if it exists.
     if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
    } else {
        firebaseApp = getApp();
    }
  } else {
    // On the client, we want to make sure we're only initializing once.
    if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
    } else {
        firebaseApp = getApp();
    }
  }

  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}

// These are the hooks that client components will primarily use.
const useAuth = () => useAuthContext();
const useFirestore = () => useFirestoreContext();
const useUser = () => useAuthUserHook(useAuth());

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  // Low-level context hooks
  useFirebase,
  useFirebaseApp,
  // Main hooks for components
  useAuth,
  useFirestore,
  useUser,
  useCollection,
  useDoc,
};
