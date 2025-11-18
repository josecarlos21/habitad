
"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  if (!isClient || !time) {
    // Render a placeholder or nothing on the server and initial client render
    // to prevent hydration mismatch.
    return (
        <div className="hidden h-5 w-72 animate-pulse rounded-md bg-muted md:block" />
    );
  }

  return (
    <div className="hidden text-sm font-medium text-muted-foreground md:block">
      {format(time, "eeee, dd 'de' MMMM, yyyy HH:mm:ss", { locale: es })}
    </div>
  );
}
