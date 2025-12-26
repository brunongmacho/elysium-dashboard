"use client";

import { useState, useCallback, memo, useMemo, useEffect } from "react";
import Image from "next/image";
import CircularProgress from "./CircularProgress";
import MarkAsKilledModal from "./MarkAsKilledModal";
import type { BossTimerDisplay } from "@/types/database";
import { formatInGMT8 } from "@/lib/timezone";
import { formatTimeRemaining } from "@/lib/boss-config";
import { useRipple } from "@/hooks/useRipple";

interface BossCardProps {
  boss: BossTimerDisplay;
  onMarkAsKilled?: (bossName: string, killedBy: string, killTime?: string, spawnTime?: string) => void;
  onCancelSpawn?: (bossName: string) => void;
  canMarkAsKilled?: boolean;
  isAdmin?: boolean;
  userName?: string;
}

function BossCard({
  boss,
  onMarkAsKilled,
  onCancelSpawn,
  canMarkAsKilled = false,
  isAdmin = false,
  userName = "",
}: BossCardProps) {
  const [isMarking, setIsMarking] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const createRipple = useRipple();

  // Update current time every second for live countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get boss image path (convert boss name to lowercase and replace spaces with hyphens)
  const imagePath = `/bosses/${boss.bossName.toLowerCase().replace(/\s+/g, "-")}.png`;

  const handleMarkAsKilled = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleConfirmKill = useCallback(async (killedBy: string, killTime?: string, spawnTime?: string) => {
    if (!onMarkAsKilled) return;

    setIsMarking(true);
    try {
      await onMarkAsKilled(boss.bossName, killedBy, killTime, spawnTime);
    } finally {
      setIsMarking(false);
    }
  }, [onMarkAsKilled, boss.bossName]);

  const handleCancelSpawn = useCallback(async () => {
    if (!onCancelSpawn) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel the spawn timer for ${boss.bossName}? This will delete the timer entry.`
    );

    if (!confirmed) return;

    setIsCancelling(true);
    try {
      await onCancelSpawn(boss.bossName);
    } finally {
      setIsCancelling(false);
    }
  }, [onCancelSpawn, boss.bossName]);

  // Calculate progress percentage and time remaining
  const { progressPercentage, timeRemaining } = useMemo(() => {
    if (!boss.nextSpawnTime) {
      return { progressPercentage: 0, timeRemaining: null };
    }

    const spawnTime = new Date(boss.nextSpawnTime).getTime();
    const remaining = spawnTime - currentTime;

    // All bosses: Calculate progress based on 24-hour countdown window for consistency
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const timeUntilSpawn = remaining;

    let percentage = 0;

    if (timeUntilSpawn <= 0) {
      // Already spawned
      percentage = 100;
    } else if (timeUntilSpawn >= twentyFourHours) {
      // More than 24 hours away, show as 0%
      percentage = 0;
    } else {
      // Within 24 hours, show countdown progress
      percentage = ((twentyFourHours - timeUntilSpawn) / twentyFourHours) * 100;
    }

    return { progressPercentage: percentage, timeRemaining: remaining };
  }, [boss.nextSpawnTime, currentTime]);

  // Calculate progressive border and glow colors based on time remaining
  const { borderColor, glowColor, glowStyle } = useMemo(() => {
    if (!timeRemaining || timeRemaining <= 0) {
      // Spawned - bright red
      return {
        borderColor: "border-red-500",
        glowColor: "shadow-red-500/50",
        glowStyle: "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)",
      };
    }

    const minutesRemaining = timeRemaining / (1000 * 60);

    if (minutesRemaining < 10) {
      // Very close (<10 min) - red
      return {
        borderColor: "border-red-500",
        glowColor: "shadow-red-500/40",
        glowStyle: "0 0 16px rgba(239, 68, 68, 0.4), 0 0 32px rgba(239, 68, 68, 0.2)",
      };
    } else if (minutesRemaining < 30) {
      // Close (<30 min) - orange-red
      return {
        borderColor: "border-orange-500",
        glowColor: "shadow-orange-500/40",
        glowStyle: "0 0 14px rgba(249, 115, 22, 0.4), 0 0 28px rgba(249, 115, 22, 0.2)",
      };
    } else if (minutesRemaining < 60) {
      // Approaching (<1 hour) - orange
      return {
        borderColor: "border-orange-400",
        glowColor: "shadow-orange-400/30",
        glowStyle: "0 0 12px rgba(251, 146, 60, 0.3), 0 0 24px rgba(251, 146, 60, 0.15)",
      };
    } else if (minutesRemaining < 180) {
      // Soon (<3 hours) - yellow
      return {
        borderColor: "border-yellow-400",
        glowColor: "shadow-yellow-400/30",
        glowStyle: "0 0 10px rgba(251, 191, 36, 0.3), 0 0 20px rgba(251, 191, 36, 0.15)",
      };
    } else if (minutesRemaining < 360) {
      // Approaching (<6 hours) - light yellow/white
      return {
        borderColor: "border-yellow-300",
        glowColor: "shadow-yellow-300/20",
        glowStyle: "0 0 8px rgba(253, 224, 71, 0.2), 0 0 16px rgba(253, 224, 71, 0.1)",
      };
    } else {
      // Far away - subtle green
      return {
        borderColor: "border-success",
        glowColor: "shadow-success/20",
        glowStyle: "0 0 6px rgba(16, 185, 129, 0.2), 0 0 12px rgba(16, 185, 129, 0.1)",
      };
    }
  }, [timeRemaining]);

  // Calculate pulse speed based on time remaining
  const pulseSpeed = useMemo(() => {
    if (!timeRemaining || timeRemaining <= 0) {
      return "0.8s"; // Very fast when spawned
    }

    const minutesRemaining = timeRemaining / (1000 * 60);

    if (minutesRemaining < 10) {
      return "1s"; // Very fast when <10 min
    } else if (minutesRemaining < 30) {
      return "1.5s"; // Fast when <30 min
    } else if (minutesRemaining < 60) {
      return "2s"; // Normal when <1 hour
    } else if (minutesRemaining < 180) {
      return "2.5s"; // Slower when <3 hours
    } else {
      return "3s"; // Slowest when far away
    }
  }, [timeRemaining]);

  return (
    <div
      className={`glass backdrop-blur-sm rounded-lg border-2 ${borderColor} boss-card-pulse shadow-lg p-4 card-3d transition-all duration-1000 overflow-visible h-full flex flex-col`}
      style={{
        boxShadow: glowStyle,
        animationDuration: pulseSpeed,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white truncate">{boss.bossName}</h3>
          <div className="flex items-center gap-1.5 mt-1 flex-nowrap">
            <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
              {boss.bossPoints}{boss.bossPoints === 1 ? "pt" : "pts"}
            </span>
            <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
              {boss.type === "timer" ? "Timed" : "Scheduled"}
            </span>
          </div>
        </div>

        {/* Boss Image */}
        <div className="relative w-20 h-20">
          <Image
            src={imagePath}
            alt={boss.bossName}
            fill
            className="object-contain"
            onError={(e) => {
              // Fallback to placeholder if image doesn't exist
              (e.target as HTMLImageElement).src = "/bosses/placeholder.svg";
            }}
          />
        </div>
      </div>

      {/* Content Section - grows to fill space */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Last Kill Info (Timer-based bosses only) */}
        {boss.type === "timer" && (boss.killedBy || boss.lastKillTime) && (
          <div className="mb-3 p-2 bg-gray-700/50 rounded text-sm">
            {boss.killedBy && (
              <div className="text-gray-300">
                <span className="text-gray-400">👤 Set by:</span>{" "}
                <span className="font-semibold">
                  {boss.isPredicted ? "Attendance" : boss.killedBy}
                </span>
              </div>
            )}
            {boss.lastKillTime && (
              <div className="text-gray-300">
                <span className="text-gray-400">🕐 Last Kill:</span>{" "}
                <span>{formatInGMT8(boss.lastKillTime, "MMM dd, hh:mm a")}</span>
              </div>
            )}
          </div>
        )}

        {/* Next Spawn Info */}
        {boss.nextSpawnTime ? (
          <div className="mb-2">
            <div className="text-sm font-semibold text-gray-300 mb-1">
              {boss.isPredicted ? "🔮 Predicted Spawn:" : "⏰ Next Spawn:"}
            </div>
            <div className="text-white text-base font-bold mb-2">
              {formatInGMT8(boss.nextSpawnTime, "MMM dd, yyyy hh:mm a")}
            </div>

            {/* Countdown Timer with Circular Progress */}
            <div className="flex justify-center py-2">
              <div className="relative">
                <CircularProgress
                  percentage={progressPercentage}
                  size={160}
                  strokeWidth={10}
                  status={boss.status}
                  timeRemaining={timeRemaining}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1">Countdown</div>
                    <div className="font-mono text-xl font-bold text-white leading-tight">
                      {timeRemaining !== null
                        ? formatTimeRemaining(timeRemaining)
                        : "--:--:--"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-3 text-center">
            <div className="text-gray-400 text-sm">No timer data available</div>
          </div>
        )}

        {/* Interval Info (Timer-based bosses) */}
        {boss.type === "timer" && boss.interval && (
          <div className="text-center text-xs text-gray-400 mb-3">
            Interval: {boss.interval}h
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {boss.type === "timer" && (canMarkAsKilled || isAdmin) && (
        <div className="flex gap-2">
          {/* Mark as Killed Button */}
          {canMarkAsKilled && (
            <button
              onClick={(e) => {
                createRipple(e);
                handleMarkAsKilled();
              }}
              disabled={isMarking}
              className={`ripple-container ${isAdmin ? 'flex-1' : 'w-full'} bg-danger hover:bg-danger/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95`}
            >
              {isMarking ? "Marking..." : "Mark as Killed"}
            </button>
          )}

          {/* Cancel Spawn Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={(e) => {
                createRipple(e);
                handleCancelSpawn();
              }}
              disabled={isCancelling}
              className={`ripple-container ${canMarkAsKilled ? 'flex-1' : 'w-full'} bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95`}
              title="Delete this boss timer (Admin only)"
            >
              {isCancelling ? "Cancelling..." : "Cancel Spawn"}
            </button>
          )}
        </div>
      )}

      {/* Mark as Killed Modal */}
      <MarkAsKilledModal
        bossName={boss.bossName}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmKill}
        defaultKilledBy={userName}
      />
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders
// Custom comparison function to check if boss data changed
export default memo(BossCard, (prevProps, nextProps) => {
  return (
    prevProps.boss.bossName === nextProps.boss.bossName &&
    prevProps.boss.status === nextProps.boss.status &&
    prevProps.boss.nextSpawnTime === nextProps.boss.nextSpawnTime &&
    prevProps.canMarkAsKilled === nextProps.canMarkAsKilled &&
    prevProps.userName === nextProps.userName
  );
});
