"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import type {
  AttendanceLeaderboardEntry,
  PointsLeaderboardEntry,
} from "@/types/database";
import type { LeaderboardResponse } from "@/types/api";
import { toLocaleStringGMT8 } from "@/lib/timezone";
import { swrFetcher } from "@/lib/fetch-utils";
import { useDebounce } from "@/hooks/useDebounce";
import { LeaderboardSkeleton } from "@/components/SkeletonLoader";
import LeaderboardPodium from "@/components/LeaderboardPodium";
import ProgressBar from "@/components/ProgressBar";
import SegmentedControl from "@/components/SegmentedControl";
import { LEADERBOARD } from "@/lib/constants";

export default function LeaderboardPage() {
  const [leaderboardType, setLeaderboardType] = useState<"attendance" | "points">("attendance");
  const [period, setPeriod] = useState<"all" | "monthly" | "weekly">("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Format: YYYY-MM
  const [selectedWeek, setSelectedWeek] = useState<string>(""); // Format: YYYY-MM-DD (week start date)
  const [limit, setLimit] = useState<number>(LEADERBOARD.DEFAULT_LIMIT);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search query to reduce API calls
  const debouncedSearch = useDebounce(searchQuery, LEADERBOARD.DEBOUNCE_DELAY);

  // Generate last 12 months for dropdown
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  });

  // Generate last 8 weeks for dropdown (using GMT+8 timezone like the bot)
  const weekOptions = Array.from({ length: 8 }, (_, i) => {
    const gmt8Offset = 8 * 60 * 60 * 1000;
    const now = new Date();

    // Go back i weeks
    const targetDate = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));

    // Convert to GMT+8
    const gmt8Time = new Date(targetDate.getTime() + gmt8Offset);
    const day = gmt8Time.getUTCDay();

    // Calculate Sunday of this week in GMT+8
    const sunday = new Date(gmt8Time);
    sunday.setUTCDate(gmt8Time.getUTCDate() - day);
    sunday.setUTCHours(0, 0, 0, 0);

    // Week start in UTC
    const weekStart = new Date(sunday.getTime() - gmt8Offset);

    // Week end (Saturday 23:59:59 GMT+8)
    const saturdayGMT8 = new Date(sunday);
    saturdayGMT8.setUTCDate(sunday.getUTCDate() + 6);
    saturdayGMT8.setUTCHours(23, 59, 59, 999);
    const weekEnd = new Date(saturdayGMT8.getTime() - gmt8Offset);

    // Convert to GMT+8 for display
    const displayStart = new Date(weekStart.getTime() + gmt8Offset);
    const displayEnd = new Date(weekEnd.getTime() + gmt8Offset);

    return {
      value: displayStart.toISOString().split('T')[0],
      label: i === 0
        ? 'This Week'
        : `${displayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })} - ${displayEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`
    };
  });

  // Build API URL
  let apiUrl = `/api/members?type=${leaderboardType}&period=${period}&limit=${limit}&search=${debouncedSearch}`;

  if (period === "monthly" && selectedMonth) {
    apiUrl += `&month=${selectedMonth}`;
  } else if (period === "weekly" && selectedWeek) {
    apiUrl += `&week=${selectedWeek}`;
  }

  const { data, error, isLoading } = useSWR<LeaderboardResponse>(apiUrl, swrFetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const leaderboardData: (AttendanceLeaderboardEntry | PointsLeaderboardEntry)[] =
    data?.data || [];

  // Prepare podium data for top 3
  const podiumData = useMemo(() => {
    if (leaderboardData.length === 0) return [];

    return leaderboardData.slice(0, 3).map((entry) => ({
      rank: entry.rank,
      memberId: entry.memberId,
      username: entry.username,
      value:
        leaderboardType === "attendance"
          ? (entry as AttendanceLeaderboardEntry).totalKills
          : (entry as PointsLeaderboardEntry).pointsAvailable,
      label:
        leaderboardType === "attendance"
          ? "Total Kills"
          : "Points Available",
    }));
  }, [leaderboardData, leaderboardType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Leaderboards</h1>
        <p className="text-gray-400">
          Top performers in attendance and bidding points
        </p>
      </div>

      {/* Leaderboard Type Tabs */}
      <div className="flex justify-center">
        <SegmentedControl
          options={[
            { value: "attendance", label: "Attendance", icon: "📊" },
            { value: "points", label: "Points", icon: "💰" },
          ]}
          value={leaderboardType}
          onChange={(value) => setLeaderboardType(value as "attendance" | "points")}
        />
      </div>

      {/* Podium for Top 3 */}
      {!isLoading && !error && podiumData.length > 0 && (
        <LeaderboardPodium entries={podiumData} type={leaderboardType} />
      )}

      {/* Filters */}
      <div className="glass backdrop-blur-sm rounded-lg border border-primary/20 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Period Filter (Attendance only) */}
          {leaderboardType === "attendance" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Period
                </label>
                <select
                  value={period}
                  onChange={(e) => {
                    const newPeriod = e.target.value as "all" | "monthly" | "weekly";
                    setPeriod(newPeriod);
                    // Reset selections when changing period
                    if (newPeriod === "monthly") {
                      setSelectedMonth(monthOptions[0].value);
                    } else if (newPeriod === "weekly") {
                      setSelectedWeek(weekOptions[0].value);
                    }
                  }}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Time</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {/* Month Selector */}
              {period === "monthly" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {monthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Week Selector */}
              {period === "weekly" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Week
                  </label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {weekOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Top N Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Show Top
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={10}>Top 10</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
              <option value={0}>All Members</option>
            </select>
          </div>

          {/* Search */}
          <div className={
            leaderboardType === "points" ? "md:col-span-3" :
            period === "all" ? "md:col-span-2" :
            "md:col-span-1"
          }>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Member
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type member name..."
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search for members by name"
            />
          </div>
        </div>

        {/* Results Count */}
        {data && (
          <div className="mt-4 text-sm text-gray-400">
            Showing {data.count} of {data.total} members
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && <LeaderboardSkeleton />}

      {/* Error State */}
      {error && (
        <div className="glass backdrop-blur-sm rounded-lg border border-danger p-6 text-center glow-danger">
          <div className="text-danger text-lg font-semibold mb-2">
            ⚠️ Failed to load leaderboard
          </div>
          <div className="text-gray-400 text-sm">
            {error.message || "Unknown error occurred"}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {!isLoading && !error && leaderboardData.length > 0 && (
        <div className="glass backdrop-blur-sm rounded-lg border border-primary/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10 border-b border-primary/20">
                {leaderboardType === "attendance" ? (
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Member
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Total Kills
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Points Earned
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Attendance Rate
                    </th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                      Member
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Points Available
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Points Earned
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Points Spent
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">
                      Consumption Rate
                    </th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-primary/10">
                {leaderboardData.map((entry, index) => (
                  <tr
                    key={entry.memberId}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-semibold">
                      {entry.rank <= 3 ? (
                        <span className="text-xl">
                          {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}
                        </span>
                      ) : (
                        entry.rank
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`/profile/${entry.memberId}`}
                        className="text-primary hover:text-primary-light font-medium hover:underline transition-colors"
                      >
                        {entry.username}
                      </a>
                    </td>
                    {leaderboardType === "attendance" ? (
                      <>
                        <td className="px-4 py-3 text-right text-white">
                          {(entry as AttendanceLeaderboardEntry).totalKills}
                        </td>
                        <td className="px-4 py-3 text-right text-success">
                          {(entry as AttendanceLeaderboardEntry).pointsEarned}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <ProgressBar
                                value={(entry as AttendanceLeaderboardEntry).attendanceRate}
                                color="info"
                                showPercentage={false}
                                className="min-w-[100px]"
                              />
                            </div>
                            <span className="text-info font-semibold text-sm min-w-[45px] text-right">
                              {(entry as AttendanceLeaderboardEntry).attendanceRate}%
                            </span>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-right text-success font-semibold">
                          {(entry as PointsLeaderboardEntry).pointsAvailable}
                        </td>
                        <td className="px-4 py-3 text-right text-info">
                          {(entry as PointsLeaderboardEntry).pointsEarned}
                        </td>
                        <td className="px-4 py-3 text-right text-danger">
                          {(entry as PointsLeaderboardEntry).pointsSpent}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <ProgressBar
                                value={(entry as PointsLeaderboardEntry).consumptionRate}
                                color="warning"
                                showPercentage={false}
                                className="min-w-[100px]"
                              />
                            </div>
                            <span className="text-warning font-semibold text-sm min-w-[45px] text-right">
                              {(entry as PointsLeaderboardEntry).consumptionRate}%
                            </span>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && leaderboardData.length === 0 && (
        <div className="glass backdrop-blur-sm rounded-lg border border-primary/20 p-12 text-center">
          <div className="text-gray-400 text-lg">No members found</div>
          <div className="text-gray-500 text-sm mt-2">
            Try adjusting your filters or search query
          </div>
        </div>
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
