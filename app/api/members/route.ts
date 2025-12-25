/**
 * Members/Leaderboard API Route
 * GET /api/members - Fetch leaderboard data (attendance or points)
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type {
  AttendanceLeaderboardEntry,
  PointsLeaderboardEntry
} from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "attendance"; // attendance | points
    const period = searchParams.get("period") || "all"; // all | monthly | weekly
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";

    const db = await getDatabase();

    if (type === "attendance") {
      // Fetch attendance leaderboard
      let attendanceData = await db
        .collection("members")
        .find(
          search
            ? { username: { $regex: search, $options: "i" } }
            : {}
        )
        .project({
          _id: 1,
          username: 1,
          attendance: 1,
          pointsEarned: 1,
        })
        .toArray();

      // Calculate attendance metrics based on period
      const leaderboard: AttendanceLeaderboardEntry[] = attendanceData.map((member) => {
        let totalKills = 0;

        if (period === "all") {
          totalKills = member.attendance?.total || 0;
        } else if (period === "monthly") {
          totalKills = member.attendance?.thisMonth || 0;
        } else if (period === "weekly") {
          totalKills = member.attendance?.thisWeek || 0;
        }

        const pointsEarned = member.pointsEarned || 0;
        const currentStreak = member.attendance?.streak?.current || 0;

        // Calculate attendance rate (simplified - could be enhanced)
        const attendanceRate = totalKills > 0 ? Math.round((totalKills / (totalKills + 10)) * 100) : 0;

        return {
          rank: 0, // Will be calculated after sorting
          username: member.username,
          memberId: member._id,
          totalKills,
          pointsEarned,
          attendanceRate,
          currentStreak,
        };
      });

      // Sort by total kills descending
      leaderboard.sort((a, b) => b.totalKills - a.totalKills);

      // Assign ranks
      leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // Apply limit
      const limitedLeaderboard = limit > 0 ? leaderboard.slice(0, limit) : leaderboard;

      return NextResponse.json({
        success: true,
        type: "attendance",
        period,
        count: limitedLeaderboard.length,
        total: leaderboard.length,
        data: limitedLeaderboard,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Fetch points leaderboard
      let pointsData = await db
        .collection("members")
        .find(
          search
            ? { username: { $regex: search, $options: "i" } }
            : {}
        )
        .project({
          _id: 1,
          username: 1,
          pointsAvailable: 1,
          pointsEarned: 1,
          pointsSpent: 1,
        })
        .toArray();

      const leaderboard: PointsLeaderboardEntry[] = pointsData.map((member) => {
        const pointsAvailable = member.pointsAvailable || 0;
        const pointsEarned = member.pointsEarned || 0;
        const pointsSpent = member.pointsSpent || 0;

        // Calculate consumption rate
        const consumptionRate = pointsEarned > 0
          ? Math.round((pointsSpent / pointsEarned) * 100)
          : 0;

        return {
          rank: 0, // Will be calculated after sorting
          username: member.username,
          memberId: member._id,
          pointsAvailable,
          pointsEarned,
          pointsSpent,
          consumptionRate,
        };
      });

      // Sort by points available descending
      leaderboard.sort((a, b) => b.pointsAvailable - a.pointsAvailable);

      // Assign ranks
      leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // Apply limit
      const limitedLeaderboard = limit > 0 ? leaderboard.slice(0, limit) : leaderboard;

      return NextResponse.json({
        success: true,
        type: "points",
        period: "all", // Points don't have period filters
        count: limitedLeaderboard.length,
        total: leaderboard.length,
        data: limitedLeaderboard,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: [],
      },
      { status: 500 }
    );
  }
}
