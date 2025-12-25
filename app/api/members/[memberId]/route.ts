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

    // Fetch member data
    const member = await db
      .collection<Member>("members")
      .findOne({ _id: memberId });

    if (!member) {
      return NextResponse.json(
        { success: false, error: "Member not found" },
        { status: 404 }
      );
    }

    // Fetch recent attendance (last 20 records)
    const recentAttendance = await db
      .collection<AttendanceRecord>("attendance")
      .find({ memberId })
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    // Calculate boss breakdown (attendance count per boss)
    const bossBreakdownPipeline = [
      { $match: { memberId } },
      {
        $group: {
          _id: {
            bossName: "$bossName",
            timestamp: "$timestamp"
          }
        }
      },
      {
        $group: {
          _id: "$_id.bossName",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ];

    const bossBreakdown = await db
      .collection("attendance")
      .aggregate(bossBreakdownPipeline)
      .toArray();

    // Get member rank (based on points available)
    const membersAbove = await db
      .collection("members")
      .countDocuments({
        pointsAvailable: { $gt: member.pointsAvailable }
      });

    const totalMembers = await db.collection("members").countDocuments({});

    const rank = membersAbove + 1;

    // Build profile response
    const profile = {
      ...member,
      recentAttendance,
      bossBreakdown: bossBreakdown.map((item: any) => ({
        bossName: item._id,
        count: item.count
      })),
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
