"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import toast from "react-hot-toast";
import BossTimerGrid from "@/components/BossTimerGrid";
import { BossGridSkeleton } from "@/components/SkeletonLoader";
import AnimatedCounter from "@/components/AnimatedCounter";
import type { BossTimersResponse, BossKillResponse } from "@/types/api";
import { toLocaleStringGMT8 } from "@/lib/timezone";
import { swrFetcher, fetchJson } from "@/lib/fetch-utils";
import { BOSS_TIMER } from "@/lib/constants";

export default function Home() {
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch boss timers with SWR (auto-refresh every 30 seconds)
  const { data, error, isLoading, mutate } = useSWR<BossTimersResponse>(
    `/api/bosses?t=${refreshKey}`,
    swrFetcher,
    {
      refreshInterval: BOSS_TIMER.REFRESH_INTERVAL,
      revalidateOnFocus: true,
    }
  );

  const handleMarkAsKilled = useCallback(async (
    bossName: string,
    killedBy: string,
    killTime?: string,
    spawnTime?: string
  ) => {
    const loadingToast = toast.loading(`Marking ${bossName} as killed...`);

    try {
      const result = await fetchJson<BossKillResponse>(
        `/api/bosses/${encodeURIComponent(bossName)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ killedBy, killTime, spawnTime }),
        }
      );

      if (result.success && result.boss) {
        const nextSpawnMsg = result.boss.nextSpawnTime
          ? `\nNext spawn: ${toLocaleStringGMT8(result.boss.nextSpawnTime)}`
          : '';
        toast.success(
          `${bossName} marked as killed!${nextSpawnMsg}`,
          { id: loadingToast }
        );
        // Refresh the data (use mutate only, not both)
        mutate();
      } else {
        toast.error(result.error || "Failed to mark boss as killed", { id: loadingToast });
      }
    } catch (err) {
      console.error("Error marking boss as killed:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to mark boss as killed",
        { id: loadingToast }
      );
    }
  }, [mutate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Boss Spawn Timers
          </h1>
          <p className="text-gray-400">
            Real-time tracking of all boss spawns
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => {
            mutate();
            setRefreshKey((k) => k + 1);
          }}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-primary/50 transition-all duration-200"
          title="Refresh boss timers"
          aria-label="Refresh boss timers"
        >
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors group-hover:rotate-180 duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="hidden sm:inline text-sm text-gray-300 group-hover:text-white transition-colors">
            Refresh
          </span>
        </button>
      </div>

      {/* Stats Bar */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/20 p-4 text-center hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={data.count} />
            </div>
            <div className="text-sm text-gray-400">Total Bosses</div>
          </div>
          <div className="glass backdrop-blur-sm rounded-lg border border-danger p-4 text-center glow-danger hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-danger">
              <AnimatedCounter value={data.bosses.filter((b) => b.status === "spawned").length} />
            </div>
            <div className="text-sm text-gray-400">Spawned</div>
          </div>
          <div className="glass backdrop-blur-sm rounded-lg border border-warning p-4 text-center glow-warning hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-warning">
              <AnimatedCounter value={data.bosses.filter((b) => b.status === "soon").length} />
            </div>
            <div className="text-sm text-gray-400">Soon (&lt;30min)</div>
          </div>
          <div className="glass backdrop-blur-sm rounded-lg border border-success p-4 text-center glow-success hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-success">
              <AnimatedCounter value={data.bosses.filter((b) => b.status === "ready").length} />
            </div>
            <div className="text-sm text-gray-400">Tracking</div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <BossGridSkeleton count={8} />}

      {/* Error State */}
      {error && (
        <div className="glass backdrop-blur-sm rounded-lg border border-danger p-6 text-center glow-danger">
          <div className="text-danger text-lg font-semibold mb-2">
            ⚠️ Failed to load boss timers
          </div>
          <div className="text-gray-400 text-sm">
            {error.message || "Unknown error occurred"}
          </div>
          <div className="text-gray-500 text-xs mt-2">
            Note: MongoDB connection may not work in sandboxed environments.
            <br />
            This will work on your local machine and on Vercel deployment.
          </div>
        </div>
      )}

      {/* Boss Grid */}
      {data && data.success && (
        <BossTimerGrid
          bosses={data.bosses}
          onMarkAsKilled={handleMarkAsKilled}
          canMarkAsKilled={session?.canMarkAsKilled || false}
          userName={session?.user?.name || ""}
        />
      )}

      {/* Last Update Time */}
      {data && data.timestamp && (
        <div className="text-center text-xs text-gray-500">
          Last updated: {toLocaleStringGMT8(data.timestamp)}
        </div>
      )}
    </div>
  );
}
