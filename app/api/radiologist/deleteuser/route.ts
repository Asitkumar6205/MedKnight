import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    // Get the id from query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Radiologist ID is required" },
        { status: 400 }
      );
    }

    // First delete the signature to handle the cascading relationship
    await db.signature.delete({
      where: {
        radiologistId: id,
      },
    });

    // Then delete the radiologist
    const deletedRadiologist = await db.radiologist.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { 
        message: "Radiologist deleted successfully", 
        radiologist: deletedRadiologist 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { 
        message: "Failed to delete radiologist", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}