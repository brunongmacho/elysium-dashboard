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
    const { killedBy, killTime, spawnTime } = body;

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

    // Use provided kill time or current time
    const lastKillTime = killTime ? new Date(killTime) : now;

    // Use provided spawn time or calculate it from kill time
    let nextSpawnTime: Date | null;
    if (spawnTime) {
      // Direct spawn time override
      nextSpawnTime = new Date(spawnTime);
    } else {
      // Calculate next spawn time from kill time
      nextSpawnTime = calculateNextSpawn(bossName, lastKillTime);
    }

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
          lastKillTime: lastKillTime.toISOString(),
          nextSpawnTime: nextSpawnTime.toISOString(),
          killedBy: killedBy || "Unknown",
          serverDown: false,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    console.log(
      `✅ Boss marked as killed: ${bossName} by ${killedBy || "Unknown"} at ${lastKillTime.toISOString()}, next spawn: ${nextSpawnTime.toISOString()}`
    );

    return NextResponse.json({
      success: true,
      message: `${bossName} marked as killed`,
      data: {
        bossName,
        lastKillTime: lastKillTime.toISOString(),
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
