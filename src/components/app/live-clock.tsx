
"use client";

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="hidden text-sm font-medium text-muted-foreground md:block">
      {format(time, "eeee, dd 'de' MMMM, yyyy HH:mm:ss", { locale: es })}
    </div>
  );
}
