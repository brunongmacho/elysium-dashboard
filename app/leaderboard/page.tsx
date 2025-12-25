"use client";

import { useState } from "react";
import useSWR from "swr";
import type {
  AttendanceLeaderboardEntry,
  PointsLeaderboardEntry,
} from "@/types/database";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LeaderboardPage() {
  const [leaderboardType, setLeaderboardType] = useState<"attendance" | "points">("attendance");
  const [period, setPeriod] = useState<"all" | "monthly" | "weekly">("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Format: YYYY-MM
  const [selectedWeek, setSelectedWeek] = useState<string>(""); // Format: YYYY-MM-DD (week start date)
  const [limit, setLimit] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  // Debounce search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setTimeout(() => setDebouncedSearch(value), 300);
  };

  // Build API URL
  let apiUrl = `/api/members?type=${leaderboardType}&period=${period}&limit=${limit}&search=${debouncedSearch}`;

  if (period === "monthly" && selectedMonth) {
    apiUrl += `&month=${selectedMonth}`;
  } else if (period === "weekly" && selectedWeek) {
    apiUrl += `&week=${selectedWeek}`;
  }

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const leaderboardData: (AttendanceLeaderboardEntry | PointsLeaderboardEntry)[] =
    data?.data || [];

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
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setLeaderboardType("attendance")}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            leaderboardType === "attendance"
              ? "text-white border-blue-500"
              : "text-gray-400 border-transparent hover:text-white"
          }`}
        >
          📊 Attendance
        </button>
        <button
          onClick={() => setLeaderboardType("points")}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            leaderboardType === "points"
              ? "text-white border-blue-500"
              : "text-gray-400 border-transparent hover:text-white"
          }`}
        >
          💰 Points
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
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
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Type member name..."
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <p className="text-lg">Loading leaderboard...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-700 p-6 text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">
            ⚠️ Failed to load leaderboard
          </div>
          <div className="text-gray-400 text-sm">
            {error.message || "Unknown error occurred"}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      {!isLoading && !error && leaderboardData.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
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
              <tbody className="divide-y divide-gray-700">
                {leaderboardData.map((entry, index) => (
                  <tr
                    key={entry.memberId}
                    className="hover:bg-gray-700/30 transition-colors"
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
                        className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
                      >
                        {entry.username}
                      </a>
                    </td>
                    {leaderboardType === "attendance" ? (
                      <>
                        <td className="px-4 py-3 text-right text-white">
                          {(entry as AttendanceLeaderboardEntry).totalKills}
                        </td>
                        <td className="px-4 py-3 text-right text-green-400">
                          {(entry as AttendanceLeaderboardEntry).pointsEarned}
                        </td>
                        <td className="px-4 py-3 text-right text-blue-400">
                          {(entry as AttendanceLeaderboardEntry).attendanceRate}%
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-right text-green-400 font-semibold">
                          {(entry as PointsLeaderboardEntry).pointsAvailable}
                        </td>
                        <td className="px-4 py-3 text-right text-blue-400">
                          {(entry as PointsLeaderboardEntry).pointsEarned}
                        </td>
                        <td className="px-4 py-3 text-right text-red-400">
                          {(entry as PointsLeaderboardEntry).pointsSpent}
                        </td>
                        <td className="px-4 py-3 text-right text-yellow-400">
                          {(entry as PointsLeaderboardEntry).consumptionRate}%
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
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <div className="text-gray-400 text-lg">No members found</div>
          <div className="text-gray-500 text-sm mt-2">
            Try adjusting your filters or search query
          </div>
        </div>
      )}

      {/* Last Update Time */}
      {data && (
        <div className="text-center text-xs text-gray-500">
          Last updated: {new Date(data.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
}
