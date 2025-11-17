import { user as mockUser } from '@/lib/mocks';
import { User } from '@/lib/types';
import { useEffect, useState } from 'react';

// This is a mock hook. In a real app, you would fetch this from your auth provider.
export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user data
        const timer = setTimeout(() => {
            setUser(mockUser);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return { user, isLoading };
};
