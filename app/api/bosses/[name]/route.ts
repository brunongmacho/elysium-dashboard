/**
 * Boss Mark as Killed API Route
 * POST /api/bosses/[name] - Mark a boss as killed and update timer
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";
import { calculateNextSpawn, getBossType } from "@/lib/boss-config";
import { bossNameSchema, bossKillSchema, validateInput } from "@/lib/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    // Check authentication and permissions
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please sign in with Discord.",
        },
        { status: 401 }
      );
    }

    if (!session.isInGuild) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be a member of the ELYSIUM guild to perform this action.",
        },
        { status: 403 }
      );
    }

    if (!session.canMarkAsKilled) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have permission to mark bosses as killed. ELYSIUM role or admin role required.",
        },
        { status: 403 }
      );
    }

    // Validate boss name parameter
    const bossName = decodeURIComponent(params.name);
    const bossNameValidation = validateInput(bossNameSchema, bossName);
    if (!bossNameValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: bossNameValidation.error,
        },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const bodyValidation = validateInput(bossKillSchema, body);
    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: bodyValidation.error,
        },
        { status: 400 }
      );
    }

    const { killedBy, killTime, spawnTime } = bodyValidation.data;

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
