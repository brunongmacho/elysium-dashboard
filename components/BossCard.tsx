"use client";

import { useState, useCallback, memo, useMemo, useEffect } from "react";
import Image from "next/image";
import CircularProgress from "./CircularProgress";
import MarkAsKilledModal from "./MarkAsKilledModal";
import type { BossTimerDisplay } from "@/types/database";
import { formatInGMT8 } from "@/lib/timezone";
import { formatTimeRemaining } from "@/lib/boss-config";
import { useRipple } from "@/hooks/useRipple";
import { calculateBossGlow, generateGlowStyle } from "@/lib/boss-glow";
import { useTimer } from "@/contexts/TimerContext";

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
  const createRipple = useRipple();

  // Use shared timer from context (performance optimization)
  const { currentTime } = useTimer();

  // Get boss image path (convert boss name to lowercase and replace spaces with hyphens)
  const imagePath = `/bosses/${boss.bossName.toLowerCase().replace(/\s+/g, "-")}.png`;
  const [imgSrc, setImgSrc] = useState(imagePath);

  // Reset image src when boss changes
  useEffect(() => {
    setImgSrc(imagePath);
  }, [imagePath]);

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

  // Calculate dynamic, theme-aware glow based on time remaining
  const { borderColor, glowStyle } = useMemo(() => {
    const glowData = calculateBossGlow(timeRemaining);
    return {
      borderColor: glowData.borderColor,
      glowStyle: generateGlowStyle(glowData.color, glowData.intensity),
    };
  }, [timeRemaining]);

  return (
    <div
      className={`glass backdrop-blur-sm rounded-lg border-2 ${borderColor} shadow-lg p-4 card-3d transition-all duration-1000 overflow-visible h-full flex flex-col`}
      style={{
        boxShadow: glowStyle,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg sm:text-xl font-bold line-clamp-2 font-game-decorative ${boss.status === 'spawned' ? 'text-energy text-danger' : 'text-white'}`}>{boss.bossName}</h3>
          {/* First row: Points and Type */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
              {boss.bossPoints}{boss.bossPoints === 1 ? "pt" : "pts"}
            </span>
            <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
              {boss.type === "timer" ? "Timed" : "Scheduled"}
            </span>
          </div>
          {/* Second row: Rotation badge */}
          {boss.rotation?.isRotating && (
            <div className="flex items-center gap-1.5 mt-1">
              {boss.rotation.isOurTurn ? (
                <span className="text-xs bg-success text-white px-1.5 py-0.5 rounded-full whitespace-nowrap glow-success font-semibold animate-pulse">
                  ⭐ OUR TURN
                </span>
              ) : (
                <span
                  className="text-xs bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded-full whitespace-nowrap"
                  title={`${boss.rotation.currentGuild}'s Turn (${boss.rotation.currentIndex}/${boss.rotation.guilds?.length || 5}) - Next: ${boss.rotation.nextGuild}`}
                >
                  🔄 {boss.rotation.currentGuild}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Boss Image - Smaller on mobile */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
          <Image
            src={imgSrc}
            alt={boss.bossName}
            fill
            className="object-contain"
            onError={() => {
              // Fallback to placeholder if image doesn't exist
              setImgSrc("/bosses/placeholder.svg");
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
            <div className="text-xs sm:text-sm font-semibold text-gray-300 mb-1">
              {boss.isPredicted ? "🔮 Predicted Spawn:" : "⏰ Next Spawn:"}
            </div>
            <div className="text-white text-sm sm:text-base font-bold mb-2">
              {formatInGMT8(boss.nextSpawnTime, "MMM dd, yyyy hh:mm a")}
            </div>

            {/* Countdown Timer with Circular Progress - Smaller on mobile */}
            <div className="flex justify-center py-2">
              <div className="relative">
                <CircularProgress
                  percentage={progressPercentage}
                  size={140}
                  strokeWidth={8}
                  status={boss.status}
                  timeRemaining={timeRemaining}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1 font-game">Countdown</div>
                    <div className="font-mono text-lg sm:text-xl font-bold text-white leading-tight font-game-decorative">
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
            <div className="text-gray-400 text-xs sm:text-sm">No timer data available</div>
          </div>
        )}

        {/* Interval Info (Timer-based bosses) */}
        {boss.type === "timer" && boss.interval && (
          <div className="text-center text-xs text-gray-400 mb-3">
            Interval: {boss.interval}h
          </div>
        )}
      </div>

      {/* Action Buttons - Consistent touch targets */}
      {boss.type === "timer" && (canMarkAsKilled || isAdmin) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Mark as Killed Button */}
          {canMarkAsKilled && (
            <button
              onClick={(e) => {
                createRipple(e);
                handleMarkAsKilled();
              }}
              disabled={isMarking}
              className={`ripple-container ${isAdmin && boss.nextSpawnTime && !boss.isPredicted ? 'sm:flex-1' : 'w-full'} bg-danger hover:bg-danger/90 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold py-2 sm:py-3 px-4 rounded transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-sm sm:text-base`}
            >
              {isMarking ? "Marking..." : "Mark as Killed"}
            </button>
          )}

          {/* Cancel Spawn Button (Admin Only, only if actual timer exists in database) */}
          {isAdmin && boss.nextSpawnTime && !boss.isPredicted && (
            <button
              onClick={(e) => {
                createRipple(e);
                handleCancelSpawn();
              }}
              disabled={isCancelling}
              className={`ripple-container ${canMarkAsKilled ? 'sm:flex-1' : 'w-full'} bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold py-2 sm:py-3 px-4 rounded transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-sm sm:text-base`}
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
  const prevBoss = prevProps.boss;
  const nextBoss = nextProps.boss;

  return (
    prevBoss.bossName === nextBoss.bossName &&
    prevBoss.status === nextBoss.status &&
    prevBoss.nextSpawnTime === nextBoss.nextSpawnTime &&
    prevBoss.lastKillTime === nextBoss.lastKillTime &&
    prevBoss.killedBy === nextBoss.killedBy &&
    prevBoss.isPredicted === nextBoss.isPredicted &&
    prevBoss.rotation?.isOurTurn === nextBoss.rotation?.isOurTurn &&
    prevBoss.rotation?.currentGuild === nextBoss.rotation?.currentGuild &&
    prevProps.canMarkAsKilled === nextProps.canMarkAsKilled &&
    prevProps.isAdmin === nextProps.isAdmin &&
    prevProps.userName === nextProps.userName
  );
});
