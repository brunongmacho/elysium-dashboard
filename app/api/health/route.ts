/**
 * Health Check API Route
 * Tests MongoDB connection and returns system status
 */

import { NextResponse } from "next/server";
import { checkConnection, getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    // Check MongoDB connection
    const isConnected = await checkConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "MongoDB connection failed",
          mongodb: false,
        },
        { status: 503 }
      );
    }

    // Get database info
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // Count members as a quick data check
    const membersCount = await db.collection("members").countDocuments();

    return NextResponse.json({
      status: "ok",
      message: "All systems operational",
      mongodb: true,
      database: db.databaseName,
      collections: collectionNames,
      membersCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        mongodb: false,
      },
      { status: 500 }
    );
  }
}
