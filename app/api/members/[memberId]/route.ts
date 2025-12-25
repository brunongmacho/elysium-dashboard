/**
 * Member Profile API Route
 * GET /api/members/[memberId] - Fetch individual member profile data
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import type { Member, AttendanceRecord } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { memberId } = params;

    if (!memberId) {
      return NextResponse.json(
        { success: false, error: "Member ID is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    console.log("[Member Profile] Looking for member:", memberId);

    // Try to find member with exact match first
    let member = await db
      .collection<Member>("members")
      .findOne({ _id: memberId });

    // If not found, try case-insensitive match
    if (!member) {
      console.log("[Member Profile] Exact match not found, trying case-insensitive...");
      const memberResult = await db
        .collection<Member>("members")
        .aggregate([
          {
            $match: {
              $expr: {
                $eq: [{ $toLower: "$_id" }, memberId.toLowerCase()]
              }
            }
          },
          { $limit: 1 }
        ])
        .toArray();

      member = memberResult[0];
    }

    if (!member) {
      // Debug: List all members to help troubleshoot
      const allMembers = await db.collection("members").find({}).project({ _id: 1 }).limit(10).toArray();
      console.log("[Member Profile] Member not found. Sample members:", allMembers.map(m => m._id));

      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    console.log("[Member Profile] Found member:", member._id);

    // Calculate actual attendance totals from attendance collection
    // Total attendance (all time) - count unique boss kills
    // Use member._id to ensure case-insensitive matching works correctly
    const totalAttendancePipeline = [
      { $match: { memberId: member._id } },
      {
        $addFields: {
          regexMatch: { $regexFind: { input: "$bossName", regex: "\\s*#\\d+\\s*$" } },
        }
      },
      {
        $addFields: {
          cleanBossName: {
            $cond: {
              if: "$regexMatch",
              then: {
                $trim: {
                  input: { $substr: ["$bossName", 0, "$regexMatch.idx"] }
                }
              },
              else: "$bossName"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            bossName: "$cleanBossName",
            timestamp: "$timestamp"
          }
        }
      },
      { $count: "total" }
    ];

    const totalAttendanceResult = await db
      .collection("attendance")
      .aggregate(totalAttendancePipeline)
      .toArray();

    const totalAttendance = totalAttendanceResult.length > 0 ? totalAttendanceResult[0].total : 0;

    // This week attendance (using GMT+8 timezone)
    const gmt8Offset = 8 * 60 * 60 * 1000;
    const now = new Date();
    const gmt8Time = new Date(now.getTime() + gmt8Offset);
    const day = gmt8Time.getUTCDay();
    const sunday = new Date(gmt8Time);
    sunday.setUTCDate(gmt8Time.getUTCDate() - day);
    sunday.setUTCHours(0, 0, 0, 0);
    const weekStart = new Date(sunday.getTime() - gmt8Offset);

    const thisWeekPipeline = [
      {
        $match: {
          memberId: member._id,
          timestamp: { $gte: weekStart }
        }
      },
      {
        $addFields: {
          regexMatch: { $regexFind: { input: "$bossName", regex: "\\s*#\\d+\\s*$" } },
        }
      },
      {
        $addFields: {
          cleanBossName: {
            $cond: {
              if: "$regexMatch",
              then: {
                $trim: {
                  input: { $substr: ["$bossName", 0, "$regexMatch.idx"] }
                }
              },
              else: "$bossName"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            bossName: "$cleanBossName",
            timestamp: "$timestamp"
          }
        }
      },
      { $count: "total" }
    ];

    const thisWeekResult = await db
      .collection("attendance")
      .aggregate(thisWeekPipeline)
      .toArray();

    const thisWeek = thisWeekResult.length > 0 ? thisWeekResult[0].total : 0;

    // This month attendance (using GMT+8 timezone)
    const gmtPlusEightNow = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    const monthStartGMT8 = new Date(Date.UTC(gmtPlusEightNow.getUTCFullYear(), gmtPlusEightNow.getUTCMonth(), 1, 0, 0, 0, 0));
    const monthStart = new Date(monthStartGMT8.getTime() - (8 * 60 * 60 * 1000));

    const thisMonthPipeline = [
      {
        $match: {
          memberId: member._id,
          timestamp: { $gte: monthStart }
        }
      },
      {
        $addFields: {
          regexMatch: { $regexFind: { input: "$bossName", regex: "\\s*#\\d+\\s*$" } },
        }
      },
      {
        $addFields: {
          cleanBossName: {
            $cond: {
              if: "$regexMatch",
              then: {
                $trim: {
                  input: { $substr: ["$bossName", 0, "$regexMatch.idx"] }
                }
              },
              else: "$bossName"
            }
          }
        }
      },
      {
        $group: {
          _id: {
            bossName: "$cleanBossName",
            timestamp: "$timestamp"
          }
        }
      },
      { $count: "total" }
    ];

    const thisMonthResult = await db
      .collection("attendance")
      .aggregate(thisMonthPipeline)
      .toArray();

    const thisMonth = thisMonthResult.length > 0 ? thisMonthResult[0].total : 0;

    // Get member rank (based on points available)
    const membersAbove = await db
      .collection("members")
      .countDocuments({
        pointsAvailable: { $gt: member.pointsAvailable }
      });

    const totalMembers = await db.collection("members").countDocuments({});

    const rank = membersAbove + 1;

    // Build profile response with calculated attendance values
    const profile = {
      ...member,
      attendance: {
        total: totalAttendance,
        thisWeek: thisWeek,
        thisMonth: thisMonth,
        byBoss: member.attendance?.byBoss || {},
        streak: member.attendance?.streak || { current: 0, longest: 0 }
      },
      rank,
      totalMembers
    };

    return NextResponse.json({
      success: true,
      data: profile,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching member profile:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
