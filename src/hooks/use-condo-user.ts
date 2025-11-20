
import { useAuth, useUser as useFirebaseUser } from "@/firebase";
import { mockUser } from '@/lib/mocks';
import { UserCondoProfile } from '@/lib/types';
import { useEffect, useState } from 'react';

// This is a mock hook. In a real app, you would fetch this from your auth provider.
export const useCondoUser = () => {
    const auth = useAuth();
    const {
        data: user,
        isLoading: isAuthLoading,
        error,
    } = useFirebaseUser(auth);

    const [profile, setProfile] = useState<UserCondoProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            // In a real app, you would fetch the user's condo profile from Firestore
            // using the user.uid. For now, we'll use the mock profile but enrich it
            // with the real user's data from Firebase Auth.
            setProfile({
                ...mockUser,
                id: user.uid,
                userId: user.uid,
                email: user.email || mockUser.email,
                name: user.displayName || mockUser.name,
                imageUrl: user.photoURL || mockUser.imageUrl,
            });
            setIsLoading(false);
        } else if (!isAuthLoading) {
            // If auth is not loading and there's no user, we can stop loading.
            setProfile(null);
            setIsLoading(false);
        }
    }, [user, isAuthLoading]);

    return { user: profile, isLoading, error };
};
