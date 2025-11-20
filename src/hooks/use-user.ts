
import { mockUser } from '@/lib/mocks';
import { UserCondoProfile } from '@/lib/types';
import { useEffect, useState } from 'react';

// This is a mock hook. In a real app, you would fetch this from your auth provider.
export const useUser = () => {
    const [user, setUser] = useState<UserCondoProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user data
        const timer = setTimeout(() => {
            setUser(mockUser);
            setIsLoading(false);
        }, 150); // Reduced delay for a snappier feel

        return () => clearTimeout(timer);
    }, []);

    return { user, isLoading };
};
