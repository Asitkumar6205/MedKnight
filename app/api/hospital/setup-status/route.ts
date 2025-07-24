// app/api/hospital/setup-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { hasCompletedSetup: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is a hospital user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, email: true }
    });

    if (!user || user.role !== 'HOSPITAL' || !user.email) {
      return NextResponse.json(
        { hasCompletedSetup: false, message: "Not a hospital user or missing email" },
        { status: 403 }
      );
    }

    // Check if hospital record exists for this user's email
    // TypeScript now knows user.email is not null
    const hospital = await db.hospital.findUnique({
      where: { email: user.email }
    });

    return NextResponse.json({
      hasCompletedSetup: !!hospital,
      hospitalId: hospital?.id || null,
      hospitalName: hospital?.name || null
    });

  } catch (error) {
    console.error("Setup status check error:", error);
    return NextResponse.json(
      { hasCompletedSetup: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}