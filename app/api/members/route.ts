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
      // Calculate date ranges for period filters
      const now = new Date();
      let dateFilter = {};

      if (period === "monthly") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = { timestamp: { $gte: monthStart } };
      } else if (period === "weekly") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        dateFilter = { timestamp: { $gte: weekStart } };
      }

      // Build aggregation pipeline to count attendance from attendance collection
      const pipeline: any[] = [
        ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
        {
          $group: {
            _id: "$memberId",
            memberName: { $first: "$memberName" },
            totalKills: { $sum: 1 },
            pointsEarned: { $sum: "$bossPoints" }
          }
        },
        {
          $lookup: {
            from: "members",
            localField: "_id",
            foreignField: "_id",
            as: "memberData"
          }
        },
        {
          $unwind: {
            path: "$memberData",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            username: { $ifNull: ["$memberData.username", "$memberName"] },
            totalKills: 1,
            pointsEarned: 1,
            currentStreak: { $ifNull: ["$memberData.attendance.streak.current", 0] }
          }
        }
      ];

      // Add search filter if provided
      if (search) {
        pipeline.push({
          $match: {
            username: { $regex: search, $options: "i" }
          }
        });
      }

      // Sort by total kills
      pipeline.push({ $sort: { totalKills: -1 } });

      // Apply limit
      if (limit > 0) {
        pipeline.push({ $limit: limit });
      }

      const attendanceData = await db
        .collection("attendance")
        .aggregate(pipeline)
        .toArray();

      // Calculate leaderboard with ranks
      const leaderboard: AttendanceLeaderboardEntry[] = attendanceData.map((member, index) => {
        const totalKills = member.totalKills || 0;
        const pointsEarned = member.pointsEarned || 0;
        const currentStreak = member.currentStreak || 0;

        // Calculate attendance rate (simplified)
        const attendanceRate = totalKills > 0 ? Math.round((totalKills / (totalKills + 10)) * 100) : 0;

        return {
          rank: index + 1,
          username: member.username,
          memberId: member._id,
          totalKills,
          pointsEarned,
          attendanceRate,
          currentStreak,
        };
      });

      return NextResponse.json({
        success: true,
        type: "attendance",
        period,
        count: leaderboard.length,
        total: leaderboard.length,
        data: leaderboard,
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
