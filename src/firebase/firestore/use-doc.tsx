
"use client";

import { useState, useEffect } from 'react';
import type { Firestore, DocumentReference, DocumentData, onSnapshot, Unsubscribe, DocumentSnapshot } from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseDocState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDoc<T>(ref: DocumentReference<DocumentData> | null) {
  const firestore = useFirestore();
  const [state, setState] = useState<UseDocState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!firestore || !ref) {
      // Firestore or ref is not ready yet.
      setState(prevState => ({...prevState, isLoading: !!firestore, data: null}));
      return;
    }
    
    setState({ data: null, isLoading: true, error: null });

    const unsubscribe: Unsubscribe = (onSnapshot as any)(
      ref,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          const data = { id: snapshot.id, ...snapshot.data() } as T;
          setState({ data, isLoading: false, error: null });
        } else {
          setState({ data: null, isLoading: false, error: new Error('Document does not exist') });
        }
      },
      (error: Error) => {
        console.error("useDoc error:", error);
        setState({ data: null, isLoading: false, error });
      }
    );

    return () => unsubscribe();
  }, [firestore, ref]); // Retrigger effect if firestore or ref changes

  return state;
}
