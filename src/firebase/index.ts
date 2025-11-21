
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

import { useCollection } from "./firestore/use-collection";
import { useDoc } from "./firestore/use-doc";
import { useUser } from "./auth/use-user";
import {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from "./provider";


let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This is a server-safe and client-safe way to initialize Firebase.
function initializeFirebase() {
  if (typeof window === "undefined") {
    // On the server, we can get away with just creating a new instance every time.
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

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useCollection,
  useDoc,
  useUser,
  useFirebase,
  useFirebaseApp,
  useAuth,
  useFirestore,
};
