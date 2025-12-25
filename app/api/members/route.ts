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
            totalKills: { $sum: 1 }
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
            pointsEarned: { $ifNull: ["$memberData.pointsEarned", 0] },
            // Streak is maintained by the bot in members collection
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

      // Calculate total unique boss kills in the period (count distinct timestamps)
      const uniqueKillsPipeline = [
        ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
        {
          $group: {
            _id: "$timestamp"
          }
        },
        {
          $count: "totalUniqueKills"
        }
      ];

      const uniqueKillsResult = await db
        .collection("attendance")
        .aggregate(uniqueKillsPipeline)
        .toArray();

      const totalUniqueKills = uniqueKillsResult.length > 0 ? uniqueKillsResult[0].totalUniqueKills : 1;

      // Calculate leaderboard with ranks
      const leaderboard: AttendanceLeaderboardEntry[] = attendanceData.map((member, index) => {
        const totalKills = member.totalKills || 0;
        const pointsEarned = member.pointsEarned || 0;
        const currentStreak = member.currentStreak || 0;

        // Calculate attendance rate as percentage of total unique boss kills attended
        const attendanceRate = totalUniqueKills > 0 ? Math.round((totalKills / totalUniqueKills) * 100) : 0;

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
      // Fetch points leaderboard from members collection (authoritative source for points)
      const pointsPipeline: any[] = [];

      // Match filter if search provided
      if (search) {
        pointsPipeline.push({
          $match: {
            username: { $regex: search, $options: "i" }
          }
        });
      }

      // Project fields
      pointsPipeline.push({
        $project: {
          _id: 1,
          username: 1,
          pointsAvailable: { $ifNull: ["$pointsAvailable", 0] },
          pointsEarned: { $ifNull: ["$pointsEarned", 0] },
          pointsSpent: { $ifNull: ["$pointsSpent", 0] }
        }
      });

      // Sort by points available
      pointsPipeline.push({ $sort: { pointsAvailable: -1 } });

      // Apply limit
      if (limit > 0) {
        pointsPipeline.push({ $limit: limit });
      }

      const pointsData = await db
        .collection("members")
        .aggregate(pointsPipeline)
        .toArray();

      const leaderboard: PointsLeaderboardEntry[] = pointsData.map((member, index) => {
        const pointsAvailable = member.pointsAvailable || 0;
        const pointsEarned = member.pointsEarned || 0;
        const pointsSpent = member.pointsSpent || 0;

        // Calculate consumption rate
        const consumptionRate = pointsEarned > 0
          ? Math.round((pointsSpent / pointsEarned) * 100)
          : 0;

        return {
          rank: index + 1,
          username: member.username,
          memberId: member._id,
          pointsAvailable,
          pointsEarned,
          pointsSpent,
          consumptionRate,
        };
      });

      return NextResponse.json({
        success: true,
        type: "points",
        period: "all", // Points don't have period filters
        count: leaderboard.length,
        total: leaderboard.length,
        data: leaderboard,
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
