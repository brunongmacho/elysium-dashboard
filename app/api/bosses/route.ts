/**
 * Boss Timers API Route
 * GET /api/bosses - Fetch all boss timers with calculated spawn times
 */

import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  getAllBossNames,
  getBossPoints,
  getBossType,
  getBossSpawnInterval,
  calculateNextSpawn,
  getNextScheduledSpawn,
  getTimeRemaining,
  getBossStatus,
} from "@/lib/boss-config";
import type { BossTimer, BossTimerDisplay } from "@/types/database";

// Cache for 30 seconds to reduce database load while staying relatively real-time
export const revalidate = 30;

export async function GET() {
  try {
    const db = await getDatabase();

    // Get all boss names from configuration
    const allBossNames = getAllBossNames();

    // Fetch all existing boss timers from MongoDB
    const bossTimers = await db
      .collection<BossTimer>("bossTimers")
      .find({})
      .toArray();

    // Create a map for quick lookup
    const timerMap = new Map<string, BossTimer>();
    bossTimers.forEach((timer) => {
      timerMap.set(timer.bossName, timer);
    });

    // Calculate kill counts for all bosses (case-insensitive, remove #1 suffix)
    const killCountPipeline = [
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
      {
        $group: {
          _id: { $toLower: "$_id.bossName" },
          count: { $sum: 1 }
        }
      }
    ];

    const killCountResults = await db
      .collection("attendance")
      .aggregate(killCountPipeline)
      .toArray();

    const killCountMap = new Map<string, number>();
    killCountResults.forEach((result: any) => {
      killCountMap.set(result._id, result.count);
    });

    // Build display data for each boss
    const bossDisplayData: BossTimerDisplay[] = [];

    for (const bossName of allBossNames) {
      const bossType = getBossType(bossName);
      if (!bossType) continue;

      const bossPoints = getBossPoints(bossName);
      const timer = timerMap.get(bossName);

      let nextSpawnTime: Date | null = null;
      let lastKillTime: Date | null = null;
      let killedBy: string | undefined;

      let isPredicted = false;

      if (bossType === "timer") {
        // Timer-based boss
        let useTimer = false;

        if (timer && timer.nextSpawnTime) {
          // Check if we're still within the grace period (35 minutes after expected spawn)
          const now = new Date();
          const spawnTime = new Date(timer.nextSpawnTime);
          const gracePeriodMs = 35 * 60 * 1000; // 35 minutes in milliseconds
          const gracePeriodEnd = new Date(spawnTime.getTime() + gracePeriodMs);

          // Use timer data if we're still within grace period
          if (now <= gracePeriodEnd) {
            useTimer = true;
            isPredicted = false;
            nextSpawnTime = spawnTime;
            lastKillTime = timer.lastKillTime ? new Date(timer.lastKillTime) : null;
            killedBy = timer.killedBy;
          }
        }

        // If no timer or past grace period, fallback to attendance collection
        if (!useTimer) {
          const lastAttendance = await db
            .collection("attendance")
            .find({ bossName: { $regex: new RegExp(`^${bossName}$`, "i") } })
            .sort({ timestamp: -1 })
            .limit(1)
            .toArray();

          if (lastAttendance.length > 0) {
            isPredicted = true;
            lastKillTime = new Date(lastAttendance[0].timestamp);
            killedBy = lastAttendance[0].memberName;
            nextSpawnTime = calculateNextSpawn(bossName, lastKillTime);
          }
        }
      } else {
        // Schedule-based boss
        isPredicted = false;
        nextSpawnTime = getNextScheduledSpawn(bossName);
      }

      const timeRemaining = getTimeRemaining(nextSpawnTime);
      const status = getBossStatus(timeRemaining);

      // Get kill count (case-insensitive)
      const killCount = killCountMap.get(bossName.toLowerCase()) || 0;

      bossDisplayData.push({
        bossName,
        bossPoints,
        type: bossType,
        killedBy,
        lastKillTime: lastKillTime || undefined,
        nextSpawnTime: nextSpawnTime || undefined,
        interval: bossType === "timer" ? getBossSpawnInterval(bossName) || undefined : undefined,
        timeRemaining: timeRemaining || undefined,
        status,
        killCount,
        isPredicted,
      });
    }

    // Sort by next spawn time (soonest first)
    bossDisplayData.sort((a, b) => {
      if (!a.nextSpawnTime) return 1;
      if (!b.nextSpawnTime) return -1;
      return a.nextSpawnTime.getTime() - b.nextSpawnTime.getTime();
    });

    return NextResponse.json(
      {
        success: true,
        count: bossDisplayData.length,
        bosses: bossDisplayData,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching boss timers:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        bosses: [],
      },
      { status: 500 }
    );
  }
}
