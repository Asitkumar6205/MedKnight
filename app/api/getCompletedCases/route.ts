// app/api/getCompletedCases/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Define the type for cases with includes
type CompletedCaseWithIncludes = Prisma.CaseGetPayload<{
  include: {
    studies: true;
    files: true;
    report: true;
    hospital: {
      select: {
        id: true;
        name: true;
        email: true;
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

    const allowedRoles = ['ADMIN', 'HOSPITAL', 'RADIOLOGIST'];
    
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { message: "Access denied. Insufficient permissions." },
        { status: 403 }
      );
    }

    let cases: CompletedCaseWithIncludes[] = [];

    if (user.role === 'HOSPITAL') {
      // For hospital users, only show their own completed cases
      const hospital = await db.hospital.findUnique({
        where: { email: user.email as string }
      });

      if (!hospital) {
        return NextResponse.json(
          { message: "Hospital not found. Please complete hospital setup first." },
          { status: 400 }
        );
      }

      // Fetch only completed cases belonging to this hospital
      cases = await db.case.findMany({
        where: {
          completedCase: true,
          hospitalId: hospital.id  // Filter by hospital ID
        },
        include: {
          studies: true,
          files: true,
          report: true,
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'  // Order by most recently updated
        }
      });

    } else if (user.role === 'RADIOLOGIST' || user.role === 'ADMIN') {
      // Radiologists and admins can see all completed cases
      cases = await db.case.findMany({
        where: {
          completedCase: true
        },
        include: {
          studies: true,
          files: true,
          report: true,
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'  // Order by most recently updated
        }
      });

    } else {
      // For other roles, return empty array
      cases = [];
    }

    return NextResponse.json({ 
      cases,
      userRole: user.role,
      message: `Retrieved ${cases.length} completed cases for ${user.role.toLowerCase()} user`
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching completed cases:", error);
    return NextResponse.json(
      { 
        message: "Something went wrong", 
        error: error instanceof Error ? error.message : error 
      },
      { status: 500 }
    );
  }
}