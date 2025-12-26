"use client";

import { useState, useCallback, memo, useMemo } from "react";
import Image from "next/image";
import Countdown from "./Countdown";
import CircularProgress from "./CircularProgress";
import MarkAsKilledModal from "./MarkAsKilledModal";
import type { BossTimerDisplay } from "@/types/database";
import { formatInGMT8 } from "@/lib/timezone";
import { useRipple } from "@/hooks/useRipple";

interface BossCardProps {
  boss: BossTimerDisplay;
  onMarkAsKilled?: (bossName: string, killedBy: string, killTime?: string, spawnTime?: string) => void;
  canMarkAsKilled?: boolean;
  userName?: string;
}

function BossCard({
  boss,
  onMarkAsKilled,
  canMarkAsKilled = false,
  userName = "",
}: BossCardProps) {
  const [isMarking, setIsMarking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const createRipple = useRipple();

  // Get boss image path (convert boss name to lowercase and replace spaces with hyphens)
  const imagePath = `/bosses/${boss.bossName.toLowerCase().replace(/\s+/g, "-")}.png`;

  // Determine card border color based on status (uses theme colors)
  const borderColor = {
    spawned: "border-danger",
    soon: "border-warning",
    ready: "border-success",
    unknown: "border-gray-500",
  }[boss.status];

  // Determine background glow effect (uses theme colors)
  const glowColor = {
    spawned: "glow-danger",
    soon: "glow-warning",
    ready: "glow-success",
    unknown: "shadow-gray-500/20",
  }[boss.status];

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

  // Calculate progress percentage and time remaining
  const { progressPercentage, timeRemaining } = useMemo(() => {
    if (!boss.nextSpawnTime || !boss.interval) {
      return { progressPercentage: 0, timeRemaining: null };
    }

    const now = new Date().getTime();
    const spawnTime = new Date(boss.nextSpawnTime).getTime();
    const intervalMs = boss.interval * 60 * 60 * 1000; // Convert hours to ms

    const elapsed = intervalMs - (spawnTime - now);
    const percentage = Math.min(Math.max((elapsed / intervalMs) * 100, 0), 100);
    const remaining = spawnTime - now;

    return { progressPercentage: percentage, timeRemaining: remaining };
  }, [boss.nextSpawnTime, boss.interval]);

  // Determine pulsing glow intensity based on time remaining
  const pulseClass = useMemo(() => {
    if (!timeRemaining) return "";

    const minutesRemaining = timeRemaining / (1000 * 60);

    if (boss.status === "spawned") {
      return "pulse-glow-fast";
    } else if (minutesRemaining < 30) {
      return "pulse-glow-fast";
    } else if (minutesRemaining < 60) {
      return "pulse-glow-slow";
    }
    return "";
  }, [timeRemaining, boss.status]);

  return (
    <div
      className={`glass backdrop-blur-sm rounded-lg border-2 ${borderColor} ${glowColor} ${pulseClass} shadow-lg p-4 card-3d transition-all duration-300`}
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
        <div className="mb-3">
          <div className="text-base font-semibold text-gray-300 mb-2">
            {boss.isPredicted ? "🔮 Predicted Spawn:" : "⏰ Next Spawn:"}
          </div>
          <div className="text-white text-lg font-bold mb-3">
            {formatInGMT8(boss.nextSpawnTime, "MMM dd, yyyy hh:mm a")}
          </div>

          {/* Countdown Timer with Circular Progress */}
          <div className="flex flex-col items-center gap-3">
            {boss.type === "timer" && boss.interval && (
              <div className="relative">
                <CircularProgress
                  percentage={progressPercentage}
                  size={100}
                  strokeWidth={6}
                  status={boss.status}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Progress</div>
                    <div className="text-sm font-bold text-white">
                      {Math.round(progressPercentage)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Countdown targetDate={new Date(boss.nextSpawnTime)} />
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

      {/* Mark as Killed Button */}
      {canMarkAsKilled && boss.type === "timer" && (
        <button
          onClick={(e) => {
            createRipple(e);
            handleMarkAsKilled();
          }}
          disabled={isMarking}
          className="ripple-container w-full bg-danger hover:bg-danger/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95"
        >
          {isMarking ? "Marking..." : "Mark as Killed"}
        </button>
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
