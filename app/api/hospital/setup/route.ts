// app/api/hospital/setup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
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
        { message: "Access denied. Hospital role required or missing email." },
        { status: 403 }
      );
    }

    const { name, phone, address, gstin, tan } = await req.json();

    // Validate required fields
    if (!name || !phone || !address) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if hospital with this email already exists
    // TypeScript now knows user.email is not null
    const existingHospital = await db.hospital.findUnique({
      where: { email: user.email }
    });

    if (existingHospital) {
      return NextResponse.json(
        { message: "Hospital with this email already exists" },
        { status: 409 }
      );
    }

    // Create hospital record using the user's email
    const hospital = await db.hospital.create({
      data: {
        name,
        email: user.email,
        phone,
        address,
        gstin: gstin || "NO",
        tan: tan || "Unregistered",
      }
    });

    return NextResponse.json({
      message: "Hospital setup completed successfully",
      hospital: {
        id: hospital.id,
        name: hospital.name,
        email: hospital.email
      }
    });

  } catch (error) {
    console.error("Hospital setup error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}