
"use client";

import { useUser as useFirebaseUser } from "@/firebase";
import { mockUser, mockAdmin } from '@/lib/mocks';
import { UserCondoProfile } from '@/lib/types';
import { useEffect, useState } from 'react';

// This hook merges the authenticated Firebase user with the mock condo profile.
export const useCondoUser = () => {
    const {
        data: firebaseUser,
        isLoading: isAuthLoading,
        error: authError,
    } = useFirebaseUser();

    const [profile, setProfile] = useState<UserCondoProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Start loading whenever auth state changes
        setIsLoading(true);

        if (isAuthLoading) {
            // If Firebase auth is loading, we are definitely loading.
            return;
        }

        if (firebaseUser) {
            // User is authenticated, determine which profile to load.
            const baseProfile = firebaseUser.email === 'admin@habitat.com' ? mockAdmin : mockUser;
            
            const fullProfile: UserCondoProfile = {
                ...baseProfile,
                id: firebaseUser.uid,
                userId: firebaseUser.uid,
                email: firebaseUser.email || baseProfile.email,
                name: firebaseUser.displayName || baseProfile.name,
                imageUrl: firebaseUser.photoURL || baseProfile.imageUrl,
            };
            
            setProfile(fullProfile);
            setIsLoading(false);
        } else {
            // No authenticated user, not loading anymore.
            setProfile(null);
            setIsLoading(false);
        }
    }, [firebaseUser, isAuthLoading]);

    return { user: profile, isLoading, error: authError };
};
