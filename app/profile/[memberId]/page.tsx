"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";

// Import member lore
import memberLore from "@/member-lore.json";

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
  rank: number;
  totalMembers: number;
  joinedAt: string;
  lastActive: string;
}

interface MemberLoreData {
  title: string;
  lore: string;
  recent_developments: string;
  specialty: string;
  reputation: string;
  stats: string;
  skills: string[];
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

  // Get member lore if available
  const lore = (memberLore as Record<string, MemberLoreData>)[profile.username];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{profile.username}</h1>
          {lore && (
            <p className="text-xl text-yellow-400 font-semibold italic mb-2">{lore.title}</p>
          )}
          <p className="text-gray-400">
            Rank #{profile.rank} of {profile.totalMembers} members
          </p>
        </div>

        {/* Member Lore Section */}
        {lore && (
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-sm rounded-lg border-2 border-yellow-600/50 p-6 mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">📜 Legend & Lore</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Origin Story</h3>
                <p className="text-gray-300 leading-relaxed">{lore.lore}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Recent Developments</h3>
                <p className="text-gray-300 leading-relaxed">{lore.recent_developments}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-1">Specialty</h4>
                  <p className="text-gray-300 text-sm">{lore.specialty}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-1">Reputation</h4>
                  <p className="text-gray-300 text-sm">{lore.reputation}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">Stats</h4>
                <p className="text-gray-300 text-sm font-mono">{lore.stats}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">Signature Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {lore.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-yellow-600/30 border border-yellow-500/50 text-yellow-200 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">ℹ️ Member Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
