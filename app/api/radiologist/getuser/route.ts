import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await db.radiologist.findMany({
      include: {
        signature: true, // Include the signature data
      },
    });

    // Transform to include signature URL for the frontend
    const transformedUsers = users.map(user => ({
      ...user,
      signatureUrl: user.signature?.path || null
    }));

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to fetch radiologists", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}