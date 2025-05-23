
// lib/lockUtils.ts
import { db } from "@/lib/db";

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