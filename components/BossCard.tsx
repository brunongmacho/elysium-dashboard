"use client";

import { useState } from "react";
import Image from "next/image";
import Countdown from "./Countdown";
import type { BossTimerDisplay } from "@/types/database";
import { format } from "date-fns";

interface BossCardProps {
  boss: BossTimerDisplay;
  onMarkAsKilled?: (bossName: string) => void;
  canMarkAsKilled?: boolean;
}

export default function BossCard({
  boss,
  onMarkAsKilled,
  canMarkAsKilled = false,
}: BossCardProps) {
  const [isMarking, setIsMarking] = useState(false);

  // Get boss image path (convert boss name to lowercase and replace spaces with hyphens)
  const imagePath = `/bosses/${boss.bossName.toLowerCase().replace(/\s+/g, "-")}.png`;

  // Determine card border color based on status
  const borderColor = {
    spawned: "border-red-500",
    soon: "border-yellow-500",
    ready: "border-green-500",
    unknown: "border-gray-500",
  }[boss.status];

  // Determine background glow effect
  const glowColor = {
    spawned: "shadow-red-500/20",
    soon: "shadow-yellow-500/20",
    ready: "shadow-green-500/20",
    unknown: "shadow-gray-500/20",
  }[boss.status];

  const handleMarkAsKilled = async () => {
    if (!onMarkAsKilled) return;

    setIsMarking(true);
    try {
      await onMarkAsKilled(boss.bossName);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border-2 ${borderColor} ${glowColor} shadow-lg p-4 hover:scale-105 transition-transform duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold text-white">{boss.bossName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
              {boss.bossPoints} {boss.bossPoints === 1 ? "pt" : "pts"}
            </span>
            <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full capitalize">
              {boss.type}
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
              (e.target as HTMLImageElement).src = "/bosses/placeholder.png";
            }}
          />
        </div>
      </div>

      {/* Last Kill Info (Timer-based bosses only) */}
      {boss.type === "timer" && (boss.killedBy || boss.lastKillTime) && (
        <div className="mb-3 p-2 bg-gray-700/50 rounded text-sm">
          {boss.killedBy && (
            <div className="text-gray-300">
              <span className="text-gray-400">👤 Killed by:</span>{" "}
              <span className="font-semibold">{boss.killedBy}</span>
            </div>
          )}
          {boss.lastKillTime && (
            <div className="text-gray-300">
              <span className="text-gray-400">🕐 Last Kill:</span>{" "}
              <span>{format(new Date(boss.lastKillTime), "MMM dd, HH:mm")}</span>
            </div>
          )}
        </div>
      )}

      {/* Next Spawn Info */}
      {boss.nextSpawnTime ? (
        <div className="mb-3">
          <div className="text-sm text-gray-400 mb-1">⏰ Next Spawn:</div>
          <div className="text-gray-200 text-sm mb-2">
            {format(new Date(boss.nextSpawnTime), "MMM dd, yyyy HH:mm")}
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center">
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
          onClick={handleMarkAsKilled}
          disabled={isMarking}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
        >
          {isMarking ? "Marking..." : "Mark as Killed"}
        </button>
      )}
    </div>
  );
}
