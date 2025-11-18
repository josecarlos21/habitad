
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 1500); // Reduced delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-full animate-pulse">
        <Icons.logo className="h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold mt-4">
            Habitat <span className="font-light text-muted-foreground">Conectado</span>
        </h1>
    </div>
  );
}
