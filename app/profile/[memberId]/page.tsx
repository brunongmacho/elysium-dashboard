"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";

interface BossBreakdown {
  bossName: string;
  count: number;
}

interface AttendanceRecord {
  _id: string;
  bossName: string;
  bossPoints: number;
  timestamp: string;
  verified: boolean;
}

interface MemberProfile {
  _id: string;
  username: string;
  pointsAvailable: number;
  pointsEarned: number;
  pointsSpent: number;
  attendance: {
    total: number;
    thisWeek: number;
    thisMonth: number;
    streak: {
      current: number;
      longest: number;
    };
  };
  recentAttendance: AttendanceRecord[];
  bossBreakdown: BossBreakdown[];
  rank: number;
  totalMembers: number;
  joinedAt: string;
  lastActive: string;
}

export default function MemberProfilePage() {
  const params = useParams();
  const memberId = params.memberId as string;
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`/api/members/${memberId}`);
        const data = await response.json();

        if (data.success) {
          setProfile(data.data);
        } else {
          setError(data.error || "Failed to load profile");
        }
      } catch (err) {
        setError("Failed to fetch member profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [memberId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || "Profile not found"}</div>
      </div>
    );
  }

  const consumptionRate = profile.pointsEarned > 0
    ? Math.round((profile.pointsSpent / profile.pointsEarned) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{profile.username}</h1>
          <p className="text-gray-400">
            Rank #{profile.rank} of {profile.totalMembers} members
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Points Available */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="text-sm text-gray-400 mb-2">💰 Points Available</div>
            <div className="text-3xl font-bold text-green-400">{profile.pointsAvailable}</div>
          </div>

          {/* Total Attendance */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="text-sm text-gray-400 mb-2">📊 Total Attendance</div>
            <div className="text-3xl font-bold text-blue-400">{profile.attendance.total}</div>
          </div>

          {/* Current Streak */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="text-sm text-gray-400 mb-2">🔥 Current Streak</div>
            <div className="text-3xl font-bold text-orange-400">{profile.attendance.streak.current}</div>
            <div className="text-xs text-gray-500 mt-1">Longest: {profile.attendance.streak.longest}</div>
          </div>

          {/* Consumption Rate */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="text-sm text-gray-400 mb-2">📈 Consumption Rate</div>
            <div className="text-3xl font-bold text-purple-400">{consumptionRate}%</div>
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">💎 Points Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-400">Points Earned</div>
              <div className="text-2xl font-bold text-green-400">{profile.pointsEarned}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Points Spent</div>
              <div className="text-2xl font-bold text-red-400">{profile.pointsSpent}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Points Available</div>
              <div className="text-2xl font-bold text-blue-400">{profile.pointsAvailable}</div>
              <div className="text-xs text-gray-500 mt-1">
                {profile.pointsEarned} - {profile.pointsSpent} = {profile.pointsAvailable}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Boss Breakdown */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">⚔️ Boss Breakdown</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {profile.bossBreakdown.map((boss, index) => (
                <div
                  key={boss.bossName}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">#{index + 1}</span>
                    <span className="text-white font-medium">{boss.bossName}</span>
                  </div>
                  <span className="text-blue-400 font-bold">{boss.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Attendance */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">📋 Recent Attendance</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {profile.recentAttendance.map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded hover:bg-gray-700/50 transition-colors"
                >
                  <div>
                    <div className="text-white font-medium">{record.bossName}</div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(record.timestamp), "MMM dd, yyyy hh:mm a")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">{record.bossPoints} pts</span>
                    {record.verified && <span className="text-green-400">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">ℹ️ Member Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Joined:</span>{" "}
              <span className="text-white">{format(new Date(profile.joinedAt), "MMM dd, yyyy")}</span>
            </div>
            <div>
              <span className="text-gray-400">Last Active:</span>{" "}
              <span className="text-white">{format(new Date(profile.lastActive), "MMM dd, yyyy hh:mm a")}</span>
            </div>
            <div>
              <span className="text-gray-400">This Week:</span>{" "}
              <span className="text-white">{profile.attendance.thisWeek} bosses</span>
            </div>
            <div>
              <span className="text-gray-400">This Month:</span>{" "}
              <span className="text-white">{profile.attendance.thisMonth} bosses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
