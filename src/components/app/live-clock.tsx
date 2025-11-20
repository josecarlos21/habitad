
"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTime(new Date());
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);
  
  if (!isClient) {
    // Render a placeholder on the server and initial client render
    // to prevent hydration mismatch.
    return <Skeleton className="hidden h-5 w-72 md:block" />;
  }

  return (
    <div className="hidden text-sm font-medium text-muted-foreground md:block">
      {time ? format(time, "eeee, dd 'de' MMMM, yyyy HH:mm:ss", { locale: es }) : "Cargando..."}
    </div>
  );
}
