"use client";

import { useEffect, useState } from "react";
import { formatTimeRemaining } from "@/lib/boss-config";

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

  // Color based on time remaining
  let colorClass = "text-green-400";
  if (timeRemaining <= 0) {
    colorClass = "text-red-400 animate-pulse";
  } else if (timeRemaining <= 30 * 60 * 1000) {
    // Less than 30 minutes
    colorClass = "text-yellow-400";
  }

  return (
    <div className={`font-mono text-2xl font-bold ${colorClass} ${className}`}>
      {formatted}
    </div>
  );
}
