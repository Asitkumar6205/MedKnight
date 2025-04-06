// app/api/getCases/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Updated query to only fetch cases where activeCase is true
    const cases = await db.case.findMany({
      where: {
        activeCase: true
      },
      include: {
        studies: true,
        files: true,
      },
    });

    return NextResponse.json({ cases }, { status: 200 });
  } catch (error) {
    console.error("Error fetching active cases:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}