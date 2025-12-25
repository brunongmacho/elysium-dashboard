/**
 * Boss Mark as Killed API Route
 * POST /api/bosses/[name] - Mark a boss as killed and update timer
 */

import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { calculateNextSpawn, getBossType } from "@/lib/boss-config";

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const bossName = decodeURIComponent(params.name);
    const body = await request.json();
    const { killedBy } = body;

    // Validate boss type (only timer-based bosses can be marked as killed)
    const bossType = getBossType(bossName);
    if (bossType !== "timer") {
      return NextResponse.json(
        {
          success: false,
          error: "Only timer-based bosses can be marked as killed",
        },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const now = new Date();

    // Calculate next spawn time
    const nextSpawnTime = calculateNextSpawn(bossName, now);

    if (!nextSpawnTime) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to calculate next spawn time",
        },
        { status: 500 }
      );
    }

    // Update or create boss timer
    const result = await db.collection("bossTimers").updateOne(
      { bossName },
      {
        $set: {
          bossName,
          lastKillTime: now.toISOString(),
          nextSpawnTime: nextSpawnTime.toISOString(),
          killedBy: killedBy || "Unknown",
          serverDown: false,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    console.log(
      `✅ Boss marked as killed: ${bossName} by ${killedBy || "Unknown"}, next spawn: ${nextSpawnTime.toISOString()}`
    );

    return NextResponse.json({
      success: true,
      message: `${bossName} marked as killed`,
      data: {
        bossName,
        lastKillTime: now.toISOString(),
        nextSpawnTime: nextSpawnTime.toISOString(),
        killedBy: killedBy || "Unknown",
      },
      modified: result.modifiedCount > 0,
      upserted: result.upsertedCount > 0,
    });
  } catch (error) {
    console.error("Error marking boss as killed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
