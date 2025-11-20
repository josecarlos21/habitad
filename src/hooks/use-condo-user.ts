
import { useUser as useFirebaseUser } from "@/firebase";
import { mockUser, mockAdmin } from '@/lib/mocks';
import { UserCondoProfile } from '@/lib/types';
import { useEffect, useState } from 'react';

// This hook merges the authenticated Firebase user with the mock condo profile.
export const useCondoUser = () => {
    const {
        data: user,
        isLoading: isAuthLoading,
        error,
    } = useFirebaseUser();

    const [profile, setProfile] = useState<UserCondoProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            let baseProfile = mockUser; // Default to resident
            if (user.email === 'admin@habitat.com') {
                baseProfile = mockAdmin;
            }

            setProfile({
                ...baseProfile,
                id: user.uid,
                userId: user.uid,
                email: user.email || baseProfile.email,
                name: user.displayName || baseProfile.name,
                imageUrl: user.photoURL || baseProfile.imageUrl,
                units: baseProfile.units, 
            });
            setIsLoading(false);
        } else if (!isAuthLoading) {
            setProfile(null);
            setIsLoading(false);
        }
    }, [user, isAuthLoading]);

    return { user: profile, isLoading, error };
};
