// app/api/getCases/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { cleanExpiredLocks } from "@/lib/lockUtils";
import { Prisma } from "@prisma/client";

// Define the type for cases with includes
type CaseWithIncludes = Prisma.CaseGetPayload<{
  include: {
    studies: true;
    files: true;
    hospital: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    lockedByUser: {
      select: {
        id: true;
        name: true;
        username: true;
      };
    };
  };
}>;

export async function GET() {
  try {
    // Get user session to determine access rights
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user and their role
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true, email: true }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Clean expired locks before fetching cases (optional)
    await cleanExpiredLocks();

    let cases: CaseWithIncludes[] = [];

    if (user.role === 'HOSPITAL') {
      // For hospital users, only show their own cases
      const hospital = await db.hospital.findUnique({
        where: { email: user.email as string }
      });

      if (!hospital) {
        return NextResponse.json(
          { message: "Hospital not found. Please complete hospital setup first." },
          { status: 400 }
        );
      }

      // Fetch cases belonging to this hospital where either activeCase OR reviewCase is true
      cases = await db.case.findMany({
        where: {
          hospitalId: hospital.id,  // Critical: Filter by hospital ID
          OR: [
            { activeCase: true },
            { reviewCase: true }
          ]
        },
        include: {
          studies: true,
          files: true,
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
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

    } else if (user.role === 'RADIOLOGIST' || user.role === 'ADMIN') {
      // Radiologists and admins can see all cases where either activeCase OR reviewCase is true
      cases = await db.case.findMany({
        where: {
          OR: [
            { activeCase: true },
            { reviewCase: true }
          ]
        },
        include: {
          studies: true,
          files: true,
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
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

    } else {
      // For other roles or pending users, return empty array
      cases = [];
    }

    return NextResponse.json({ 
      cases,
      userRole: user.role,
      message: `Retrieved ${cases.length} cases for ${user.role.toLowerCase()} user`
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
