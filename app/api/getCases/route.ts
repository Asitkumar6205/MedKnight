// app/api/getCases/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Updated query to only fetch cases where activeCase is true
    const cases = await db.case.findMany({
      where: {
        activeCase: true
      },
      include: {
        studies: true,
        files: true,
        lockedByUser: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ cases }, { status: 200 });
  } catch (error) {
    console.error("Error fetching active cases:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

// Utility function to check if locks have expired and clean them up
export async function cleanExpiredLocks() {
  try {
    const now = new Date();
    
    const expiredLocks = await db.case.updateMany({
      where: {
        isLocked: true,
        lockExpiry: {
          lt: now,
        },
      },
      data: {
        isLocked: false,
        lockedBy: null,
        lockedAt: null,
        lockExpiry: null,
      },
    });

    console.log(`Cleaned up ${expiredLocks.count} expired locks`);
    return expiredLocks.count;
  } catch (error) {
    console.error('Error cleaning expired locks:', error);
    throw error;
  }
}