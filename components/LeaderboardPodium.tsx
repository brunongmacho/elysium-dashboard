"use client";

import Link from "next/link";
import AnimatedCounter from "./AnimatedCounter";

interface PodiumEntry {
  rank: number;
  memberId: string;
  username: string;
  value: number;
  label: string;
}

interface LeaderboardPodiumProps {
  entries: PodiumEntry[];
  type: "attendance" | "points";
}

export default function LeaderboardPodium({ entries, type }: LeaderboardPodiumProps) {
  if (entries.length === 0) return null;

  // Ensure we have exactly 3 entries (or less)
  const podiumEntries = entries.slice(0, 3);

  // Get colors based on rank
  const getColors = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          medal: "🥇",
          bg: "from-yellow-500/20 to-yellow-600/10",
          border: "border-yellow-500/50",
          text: "text-yellow-400",
          glow: "shadow-yellow-500/30",
          height: "h-32",
        };
      case 2:
        return {
          medal: "🥈",
          bg: "from-gray-400/20 to-gray-500/10",
          border: "border-gray-400/50",
          text: "text-gray-300",
          glow: "shadow-gray-400/30",
          height: "h-24",
        };
      case 3:
        return {
          medal: "🥉",
          bg: "from-amber-600/20 to-amber-700/10",
          border: "border-amber-600/50",
          text: "text-amber-500",
          glow: "shadow-amber-600/30",
          height: "h-20",
        };
      default:
        return {
          medal: "",
          bg: "from-gray-700/20 to-gray-800/10",
          border: "border-gray-600/50",
          text: "text-gray-400",
          glow: "shadow-gray-600/30",
          height: "h-16",
        };
    }
  };

  // Reorder for podium display: [2nd, 1st, 3rd]
  const displayOrder = [
    podiumEntries[1], // 2nd place on left
    podiumEntries[0], // 1st place in center
    podiumEntries[2], // 3rd place on right
  ].filter(Boolean);

  return (
    <div className="glass backdrop-blur-sm rounded-lg border border-primary/20 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-2xl font-bold text-gold text-rpg-title mb-4 sm:mb-6 text-center">
        🏆 Top 3 {type === "attendance" ? "Attendance" : "Points"}
      </h2>

      <div className="flex items-end justify-center gap-4 max-w-2xl mx-auto">
        {displayOrder.map((entry) => {
          if (!entry) return null;

          const colors = getColors(entry.rank);

          return (
            <div
              key={entry.memberId}
              className="flex-1 max-w-[200px]"
              style={{
                animationDelay: `${entry.rank * 0.1}s`,
              }}
            >
              {/* Card */}
              <div
                className={`
                  glass backdrop-blur-sm rounded-lg border-2 ${colors.border} ${colors.glow}
                  bg-gradient-to-b ${colors.bg}
                  p-3 sm:p-4 text-center
                  hover:scale-105 transition-all duration-300
                  fade-in-up
                `}
              >
                {/* Medal */}
                <div className="text-4xl sm:text-5xl mb-2 animate-bounce">{colors.medal}</div>

                {/* Rank */}
                <div className={`text-base sm:text-lg font-bold ${colors.text} mb-2 font-game-decorative`}>
                  #{entry.rank}
                </div>

                {/* Username */}
                <Link
                  href={`/profile/${entry.memberId}`}
                  className="block text-sm sm:text-base text-white font-semibold mb-2 hover:text-primary active:scale-95 transition-all truncate font-game"
                >
                  {entry.username}
                </Link>

                {/* Value */}
                <div className="text-xl sm:text-2xl font-bold text-white mb-1 font-game-decorative">
                  <AnimatedCounter value={entry.value} duration={1500} />
                </div>
                <div className="text-xs sm:text-sm text-gray-400 font-game">{entry.label}</div>
              </div>

              {/* Podium Base */}
              <div
                className={`
                  ${colors.height} ${colors.bg}
                  bg-gradient-to-t
                  border-t-2 ${colors.border}
                  rounded-b-lg
                  flex items-center justify-center
                  transition-all duration-300
                `}
              >
                <div className={`text-2xl sm:text-3xl font-bold ${colors.text} opacity-50 font-game-decorative`}>
                  {entry.rank}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
