"use client";

import { useEffect, useState } from "react";
import { formatTimeRemaining } from "@/lib/boss-config";
import { BOSS_TIMER } from "@/lib/constants";

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

export default function Countdown({ targetDate, className = "" }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(() => {
    return targetDate.getTime() - Date.now();
  });

  useEffect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      const remaining = targetDate.getTime() - Date.now();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatted = formatTimeRemaining(timeRemaining);

  // Color based on time remaining (uses theme colors)
  let colorClass = "text-success";
  if (timeRemaining <= 0) {
    colorClass = "text-danger animate-pulse";
  } else if (timeRemaining <= BOSS_TIMER.SOON_THRESHOLD) {
    // Less than 30 minutes = "soon"
    colorClass = "text-warning";
  }

  return (
    <div className={`font-mono text-2xl font-bold ${colorClass} ${className}`}>
      {formatted}
    </div>
  );
}
