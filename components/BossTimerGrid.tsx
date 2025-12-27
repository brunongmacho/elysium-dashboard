"use client";

import { useState, useMemo } from "react";
import BossCard from "./BossCard";
import { FilterChip } from "./ui/FilterChip";
import type { BossTimerDisplay } from "@/types/database";

interface BossTimerGridProps {
  bosses: BossTimerDisplay[];
  onMarkAsKilled?: (bossName: string, killedBy: string, killTime?: string, spawnTime?: string) => Promise<void>;
  onCancelSpawn?: (bossName: string) => Promise<void>;
  canMarkAsKilled?: boolean;
  isAdmin?: boolean;
  userName?: string;
}

export default function BossTimerGrid({
  bosses,
  onMarkAsKilled,
  onCancelSpawn,
  canMarkAsKilled = false,
  isAdmin = false,
  userName = "",
}: BossTimerGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "timer" | "schedule">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "spawned" | "soon" | "ready">("all");

  // Filter and search bosses
  const filteredBosses = useMemo(() => {
    return bosses.filter((boss) => {
      // Search filter
      if (
        searchQuery &&
        !boss.bossName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (filterType !== "all" && boss.type !== filterType) {
        return false;
      }

      // Status filter
      if (filterStatus !== "all" && boss.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [bosses, searchQuery, filterType, filterStatus]);

  // Count by status
  const statusCounts = useMemo(() => {
    return {
      spawned: bosses.filter((b) => b.status === "spawned").length,
      soon: bosses.filter((b) => b.status === "soon").length,
      ready: bosses.filter((b) => b.status === "ready").length,
    };
  }, [bosses]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Search Boss
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type boss name..."
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              aria-label="Search for bosses by name"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Boss Type
            </label>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "all" | "timer" | "schedule")
              }
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              aria-label="Filter bosses by type"
            >
              <option value="all">All Types</option>
              <option value="timer">Timer-Based</option>
              <option value="schedule">Schedule-Based</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as "all" | "spawned" | "soon" | "ready"
                )
              }
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              aria-label="Filter bosses by status"
            >
              <option value="all">All Status</option>
              <option value="spawned">
                🔴 Spawned ({statusCounts.spawned})
              </option>
              <option value="soon">🟡 Soon ({statusCounts.soon})</option>
              <option value="ready">🟢 Tracking ({statusCounts.ready})</option>
            </select>
          </div>
        </div>

        {/* Active Filters Chips */}
        {(searchQuery || filterType !== "all" || filterStatus !== "all") && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery && (
              <FilterChip
                label={`Search: "${searchQuery}"`}
                onRemove={() => setSearchQuery("")}
                color="primary"
                icon={<span>🔍</span>}
              />
            )}
            {filterType !== "all" && (
              <FilterChip
                label={filterType === "timer" ? "Timer-Based" : "Schedule-Based"}
                onRemove={() => setFilterType("all")}
                color="accent"
              />
            )}
            {filterStatus !== "all" && (
              <FilterChip
                label={
                  filterStatus === "spawned"
                    ? "Spawned"
                    : filterStatus === "soon"
                    ? "Soon"
                    : "Tracking"
                }
                onRemove={() => setFilterStatus("all")}
                color={
                  filterStatus === "spawned"
                    ? "danger"
                    : filterStatus === "soon"
                    ? "warning"
                    : "success"
                }
                icon={
                  filterStatus === "spawned"
                    ? <span>🔴</span>
                    : filterStatus === "soon"
                    ? <span>🟡</span>
                    : <span>🟢</span>
                }
              />
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredBosses.length} of {bosses.length} bosses
        </div>
      </div>

      {/* Boss Grid */}
      {filteredBosses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredBosses.map((boss, index) => (
            <div
              key={boss.bossName}
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <BossCard
                boss={boss}
                onMarkAsKilled={onMarkAsKilled}
                onCancelSpawn={onCancelSpawn}
                canMarkAsKilled={canMarkAsKilled}
                isAdmin={isAdmin}
                userName={userName}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <div className="text-gray-400 text-lg">No bosses found</div>
          <div className="text-gray-500 text-sm mt-2">
            Try adjusting your filters or search query
          </div>
        </div>
      )}
    </div>
  );
}
