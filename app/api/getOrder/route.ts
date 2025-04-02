import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const cases = await db.active.findMany({
      include: {
        studies: true,
        files: true,
      },
    });

    return NextResponse.json({ cases }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
