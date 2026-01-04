"use client";

import { useEffect, useState, memo, useMemo } from "react";
import { formatTimeRemaining } from "@/lib/boss-config";
import { BOSS_TIMER } from "@/lib/constants";

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

const Countdown = memo(function Countdown({ targetDate, className = "" }: CountdownProps) {
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

  const formatted = useMemo(() => formatTimeRemaining(timeRemaining), [timeRemaining]);

  // Color based on time remaining (uses theme colors)
  const colorClass = useMemo(() => {
    if (timeRemaining <= 0) {
      return "text-danger animate-pulse";
    } else if (timeRemaining <= BOSS_TIMER.SOON_THRESHOLD) {
      // Less than 30 minutes = "soon"
      return "text-warning";
    }
    return "text-success";
  }, [timeRemaining]);

  return (
    <div className={`font-mono text-2xl font-bold ${colorClass} ${className}`}>
      {formatted}
    </div>
  );
});

export default Countdown;
