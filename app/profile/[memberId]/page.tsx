"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatInGMT8 } from "@/lib/timezone";
import Footer from "@/components/Footer";

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white text-xl font-game">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass backdrop-blur-sm rounded-lg border border-danger p-8 text-center glow-danger">
          <div className="text-danger text-xl font-game-decorative mb-2">⚠️ {error || "Profile not found"}</div>
          <a href="/leaderboard" className="text-primary hover:text-primary-light text-sm font-game transition-colors mt-4 inline-block">
            ← Back to Leaderboard
          </a>
        </div>
      </div>
    );
  }

  const consumptionRate = profile.pointsEarned > 0
    ? Math.round((profile.pointsSpent / profile.pointsEarned) * 100)
    : 0;

  // Get member lore if available
  const lore = (memberLore as Record<string, MemberLoreData>)[profile.username];

  return (
    <div className="space-y-8 pb-32">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl text-gold text-rpg-title mb-4">{profile.username}</h1>
          {lore && (
            <p className="text-xl sm:text-2xl text-silver font-game-decorative italic mb-2">{lore.title}</p>
          )}
          <p className="text-primary-light font-game">
            Rank <span className="text-accent-bright font-semibold">#{profile.rank}</span> of {profile.totalMembers} members
          </p>
        </div>

        {/* Member Lore Section */}
        {lore && (
          <div className="glass backdrop-blur-sm rounded-lg border-2 border-accent/50 p-4 sm:p-6 mb-8 glow-accent card-3d hover:scale-[1.01] transition-transform duration-200">
            <h2 className="text-2xl sm:text-3xl text-gold text-rpg-title mb-6">📜 Legend & Lore</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-accent-bright mb-3 font-game-decorative">Origin Story</h3>
                <p className="text-gray-300 leading-relaxed font-game text-sm sm:text-base">{lore.lore}</p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-accent-bright mb-3 font-game-decorative">Recent Developments</h3>
                <p className="text-gray-300 leading-relaxed font-game text-sm sm:text-base">{lore.recent_developments}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-primary-bright mb-2 font-game">Specialty</h4>
                  <p className="text-gray-300 text-sm font-game">{lore.specialty}</p>
                </div>
                <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-primary-bright mb-2 font-game">Reputation</h4>
                  <p className="text-gray-300 text-sm font-game">{lore.reputation}</p>
                </div>
              </div>

              <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4">
                <h4 className="text-sm sm:text-base font-semibold text-primary-bright mb-2 font-game">Stats</h4>
                <p className="text-gray-300 text-xs sm:text-sm font-mono">{lore.stats}</p>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-semibold text-primary-bright mb-3 font-game">Signature Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {lore.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-accent/20 border border-accent/50 text-accent-bright px-3 py-1.5 rounded-full text-xs sm:text-sm font-game transition-all duration-200 hover:bg-accent/30 hover:scale-105 cursor-default"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Points Available */}
          <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 hover:border-accent transition-all duration-200 card-3d hover:scale-105 glow-accent">
            <div className="text-xs sm:text-sm text-primary-light mb-2 font-game">💰 Points Available</div>
            <div className="text-2xl sm:text-3xl font-bold text-accent-bright font-game-decorative">{profile.pointsAvailable}</div>
          </div>

          {/* Total Attendance */}
          <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 hover:border-primary transition-all duration-200 card-3d hover:scale-105 glow-primary">
            <div className="text-xs sm:text-sm text-primary-light mb-2 font-game">📊 Total Attendance</div>
            <div className="text-2xl sm:text-3xl font-bold text-primary-bright font-game-decorative">{profile.attendance.total}</div>
          </div>

          {/* Consumption Rate */}
          <div className="glass backdrop-blur-sm rounded-lg border border-accent/30 p-4 sm:p-6 hover:border-accent transition-all duration-200 card-3d hover:scale-105 glow-accent sm:col-span-2 lg:col-span-1">
            <div className="text-xs sm:text-sm text-primary-light mb-2 font-game">📈 Consumption Rate</div>
            <div className="text-2xl sm:text-3xl font-bold text-accent-bright font-game-decorative">{consumptionRate}%</div>
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 mb-8 card-3d hover:scale-[1.01] transition-transform duration-200">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-gold text-rpg-title mb-6">💎 Points Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="glass-strong backdrop-blur-sm rounded-lg border border-primary/20 p-4 text-center">
              <div className="text-xs sm:text-sm text-primary-light font-game mb-1">Points Earned</div>
              <div className="text-xl sm:text-2xl font-bold text-accent-bright font-game-decorative">+{profile.pointsEarned}</div>
            </div>
            <div className="glass-strong backdrop-blur-sm rounded-lg border border-primary/20 p-4 text-center">
              <div className="text-xs sm:text-sm text-primary-light font-game mb-1">Points Spent</div>
              <div className="text-xl sm:text-2xl font-bold text-danger-bright font-game-decorative">-{profile.pointsSpent}</div>
            </div>
            <div className="glass-strong backdrop-blur-sm rounded-lg border border-primary/20 p-4 text-center">
              <div className="text-xs sm:text-sm text-primary-light font-game mb-1">Points Available</div>
              <div className="text-xl sm:text-2xl font-bold text-primary-bright font-game-decorative">{profile.pointsAvailable}</div>
            </div>
          </div>
        </div>

        {/* Member Info */}
        <div className="glass backdrop-blur-sm rounded-lg border border-primary/30 p-4 sm:p-6 mt-8 card-3d hover:scale-[1.01] transition-transform duration-200">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-gold text-rpg-title mb-6">ℹ️ Member Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="glass-strong backdrop-blur-sm rounded-lg border border-primary/20 p-3 sm:p-4">
              <span className="text-primary-light font-game block mb-1">Last Active:</span>
              <span className="text-white font-game-decorative">{formatInGMT8(profile.lastActive, "MMM dd, yyyy hh:mm a")}</span>
            </div>
            <div className="glass-strong backdrop-blur-sm rounded-lg border border-primary/20 p-3 sm:p-4">
              <span className="text-primary-light font-game block mb-1">This Week:</span>
              <span className="text-accent-bright font-semibold font-game-decorative">{profile.attendance.thisWeek} bosses</span>
            </div>
            <div className="glass-strong backdrop-blur-sm rounded-lg border border-primary/20 p-3 sm:p-4">
              <span className="text-primary-light font-game block mb-1">This Month:</span>
              <span className="text-accent-bright font-semibold font-game-decorative">{profile.attendance.thisMonth} bosses</span>
            </div>
          </div>
        </div>
      <Footer />
    </div>
  );
}
