// app/api/radiologist/check-setup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { hasCompleted: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if user is a radiologist user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, email: true },
    });

    if (!user || user.role !== "RADIOLOGIST" || !user.email) {
      return NextResponse.json(
        {
          hasCompleted: false,
          message: "Not a radiologist user or missing email",
        },
        { status: 403 }
      );
    }

    // Check if radiologist record exists for this user's email
    const radiologist = await db.radiologist.findUnique({
      where: { email: user.email },
      include: {
        signature: true, // Include signature to check if setup is fully complete
      },
    });

    // Consider setup complete if radiologist record exists with basic required fields
    const isSetupComplete =
      !!radiologist &&
      !!radiologist.name &&
      !!radiologist.phone &&
      !!radiologist.subspeciality &&
      !!radiologist.mrn;

    return NextResponse.json({
      hasCompleted: isSetupComplete,
      radiologistId: radiologist?.id || null,
      radiologistName: radiologist?.name || null,
      hasSignature: !!radiologist?.signature,
    });
  } catch (error) {
    console.error("Radiologist setup check error:", error);
    return NextResponse.json(
      { hasCompleted: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

