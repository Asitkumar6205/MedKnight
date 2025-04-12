import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { patientId, doctorPhNo, technicianName, reviewReason } = body;
    
    // Validate required fields
    if (!patientId) {
      return NextResponse.json(
        { message: "Patient ID is required" },
        { status: 400 }
      );
    }
    
    // Update the case in the database
    const updatedCase = await db.case.update({
      where: { patientId: patientId },
      data: {
        doctorPhNo,
        technicianName,
        reviewReason,
        reviewCase: true, // Set this to true since the case is being reviewed
      },
    });
    
    return NextResponse.json({ 
      message: "Case review information updated successfully",
      case: updatedCase 
    });
    
  } catch (error) {
    console.error("Error updating case review information:", error);
    return NextResponse.json(
      { message: "Failed to update case review information", error },
      { status: 500 }
    );
  }
}