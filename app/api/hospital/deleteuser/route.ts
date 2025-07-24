import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path as needed

export async function DELETE(req: Request) {
  try {
    // Get session to extract user email and role
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized - No valid session found" },
        { status: 401 }
      );
    }

    // Extract user ID from URL parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("Attempting to delete user ID:", userId);

    // First, find the user to check if it exists and get hospital info
    const userToDelete = await db.hospitalUser.findUnique({
      where: { id: userId },
      include: {
        hospital: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!userToDelete) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    console.log("Found user to delete:", userToDelete);

    // Handle different user roles for authorization
    if (session.user.role === "ADMIN") {
      // Admin can delete any user
      console.log("Admin deleting user");
    } else if (session.user.role === "HOSPITAL") {
      // Hospital can only delete users from their own hospital
      if (userToDelete.hospital.email !== session.user.email) {
        return NextResponse.json(
          { message: "Forbidden: You can only delete users from your hospital" },
          { status: 403 }
        );
      }
      console.log("Hospital user deleting their own hospital's user");
    } else {
      // Radiologist or other roles cannot delete users
      return NextResponse.json(
        { message: "Insufficient permissions to delete users" },
        { status: 403 }
      );
    }

    // Delete the user
    await db.hospitalUser.delete({
      where: { id: userId }
    });

    console.log("User deleted successfully");

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Server Error deleting user:", error);
    
    // Handle Prisma errors
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Something went wrong while deleting user",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}