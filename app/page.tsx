"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import BossTimerGrid from "@/components/BossTimerGrid";
import type { BossTimerDisplay } from "@/types/database";
import { toLocaleStringGMT8 } from "@/lib/timezone";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch boss timers with SWR (auto-refresh every 30 seconds)
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    bosses: BossTimerDisplay[];
    count: number;
    timestamp: string;
  }>(`/api/bosses?t=${refreshKey}`, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
  });

  const handleMarkAsKilled = async (bossName: string, killedBy: string, killTime?: string, spawnTime?: string) => {
    try {
      const response = await fetch(`/api/bosses/${encodeURIComponent(bossName)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ killedBy, killTime, spawnTime }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`${bossName} marked as killed! Next spawn: ${toLocaleStringGMT8(result.data.nextSpawnTime)}`);
        // Refresh the data
        mutate();
        setRefreshKey((k) => k + 1);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error marking boss as killed:", err);
      alert("Failed to mark boss as killed. Check console for details.");
    }
  };

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
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Bar */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 text-center">
            <div className="text-2xl font-bold text-white">{data.count}</div>
            <div className="text-sm text-gray-400">Total Bosses</div>
          </div>
          <div className="bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-700 p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {data.bosses.filter((b) => b.status === "spawned").length}
            </div>
            <div className="text-sm text-gray-400">Spawned</div>
          </div>
          <div className="bg-yellow-900/20 backdrop-blur-sm rounded-lg border border-yellow-700 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {data.bosses.filter((b) => b.status === "soon").length}
            </div>
            <div className="text-sm text-gray-400">Soon (&lt;30min)</div>
          </div>
          <div className="bg-green-900/20 backdrop-blur-sm rounded-lg border border-green-700 p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {data.bosses.filter((b) => b.status === "ready").length}
            </div>
            <div className="text-sm text-gray-400">Ready</div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <svg
              className="animate-spin h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-lg">Loading boss timers...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-700 p-6 text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">
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
      {data && (
        <div className="text-center text-xs text-gray-500">
          Last updated: {toLocaleStringGMT8(data.timestamp)}
        </div>
      )}
    </div>
  );
}
