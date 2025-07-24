import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path as needed

export async function GET(req: Request) {
  try {
    // Get session to extract user email and role
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized - No valid session found" },
        { status: 401 }
      );
    }

    console.log("Session user:", session.user);

    // Handle different user roles
    if (session.user.role === "ADMIN") {
      // Admin can see all hospital users
      const users = await db.hospitalUser.findMany({
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log("Admin fetched all users:", users.length);
      return NextResponse.json({ users });
    }

    if (session.user.role === "HOSPITAL") {
      // Find hospital by matching session user email with hospital email
      const hospital = await db.hospital.findUnique({
        where: { email: session.user.email },
        select: { id: true, name: true }
      });

      if (!hospital) {
        return NextResponse.json(
          { message: "Hospital not found for the current user" },
          { status: 404 }
        );
      }

      console.log("Found hospital:", hospital);

      // Fetch users belonging to this hospital only
      const users = await db.hospitalUser.findMany({
        where: {
          hospitalId: hospital.id
        },
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log("Hospital users fetched:", users.length);
      return NextResponse.json({ users });
    }

    if (session.user.role === "RADIOLOGIST") {
      // Radiologist can see all hospital users (for case review purposes)
      const users = await db.hospitalUser.findMany({
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log("Radiologist fetched all users:", users.length);
      return NextResponse.json({ users });
    }

    // If role doesn't match any of the above
    return NextResponse.json(
      { message: "Insufficient permissions" },
      { status: 403 }
    );

  } catch (error) {
    console.error("Server Error fetching users:", error);
    return NextResponse.json(
      {
        message: "Something went wrong while fetching users",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}