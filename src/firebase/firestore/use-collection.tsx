
"use client";

import { useState, useEffect } from 'react';
import type { Firestore, Query, DocumentData, onSnapshot, Unsubscribe, QuerySnapshot } from 'firebase/firestore';
import { useFirestore } from '../provider';

interface UseCollectionState<T> {
  data: T[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCollection<T>(query: Query<DocumentData> | null) {
  const firestore = useFirestore();
  const [state, setState] = useState<UseCollectionState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!firestore || !query) {
      // Firestore or query is not ready yet.
      // Set loading to false if query is explicitly null, but might be true if firestore is null
      setState(prevState => ({...prevState, isLoading: !!firestore, data: null}));
      return;
    }

    setState({ data: null, isLoading: true, error: null });

    const unsubscribe: Unsubscribe = (onSnapshot as any)(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data: T[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as T));
        setState({ data, isLoading: false, error: null });
      },
      (error: Error) => {
        console.error("useCollection error:", error);
        setState({ data: null, isLoading: false, error });
      }
    );

    return () => unsubscribe();
  }, [firestore, query]); // Retrigger effect if firestore or query changes

  return state;
}
