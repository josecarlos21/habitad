
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Firestore, Query, DocumentData, Unsubscribe, QuerySnapshot } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
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

  // Memoize the query to prevent re-renders from creating new query objects
  const memoizedQuery = useMemo(() => query, [query]);

  useEffect(() => {
    if (!firestore || !memoizedQuery) {
      setState(prevState => ({...prevState, isLoading: false, data: null}));
      return;
    }

    setState({ data: null, isLoading: true, error: null });

    const unsubscribe: Unsubscribe = onSnapshot(
      memoizedQuery,
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
  }, [firestore, memoizedQuery]);

  return state;
}
