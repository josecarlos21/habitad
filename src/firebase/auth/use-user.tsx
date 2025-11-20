
"use client";

import { useEffect, useState } from 'react';
import type { Auth, User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

export function useUser(auth: Auth) {
  const [userState, setUserState] = useState<{
    data: User | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUserState({ data: user, isLoading: false, error: null });
      },
      (error) => {
        setUserState({ data: null, isLoading: false, error });
      }
    );

    return () => unsubscribe();
  }, [auth]);

  return userState;
}
