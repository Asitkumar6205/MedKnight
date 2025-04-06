// app/api/updateActiveCase/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const { patientId, isActive } = await req.json();

    if (!patientId) {
      return NextResponse.json({ message: "Patient ID is required" }, { status: 400 });
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ message: "isActive must be a boolean value" }, { status: 400 });
    }

    // Try to update the activeCase field in the Case table
    try {
      const updatedCase = await db.case.update({
        where: {
          patientId: patientId
        },
        data: {
          activeCase: isActive
        }
      });

      return NextResponse.json({ 
        message: "Case status updated successfully",
        case: updatedCase
      }, { status: 200 });
    } catch (e) {
      // If the case doesn't exist yet, provide a clearer error
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') { // Record not found
          return NextResponse.json({ 
            message: "Case not found for the provided patient ID", 
            error: e.message 
          }, { status: 404 });
        }
      }
      throw e; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error updating case status:", error);
    return NextResponse.json(
      { message: "Failed to update case status", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}