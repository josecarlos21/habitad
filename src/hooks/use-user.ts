import { user as mockUser } from '@/lib/mocks';
import { User } from '@/lib/types';
import { useEffect, useState } from 'react';

// This is a mock hook. In a real app, you would fetch this from your auth provider.
export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Simulate fetching user data
        setUser(mockUser);
    }, []);

    return { user };
};
