import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const auth = "Basic " + Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString("base64");

    // Step 1: Fetch all study IDs from Orthanc




    
    const studiesResponse = await fetch("https://archive-x1r8.medknight.in/studies", {
      method: "GET",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });

    if (!studiesResponse.ok) {
      const errorText = await studiesResponse.text();
      return NextResponse.json({ message: `Failed to fetch studies: ${errorText}` }, { status: studiesResponse.status });
    }

    const studyIds: string[] = await studiesResponse.json();

    if (studyIds.length === 0) {
      return NextResponse.json({ message: "No studies found to delete" }, { status: 200 });
    }

    // Step 2: Bulk delete all studies
    const deleteResponse = await fetch("https://archive-x1r8.medknight.in/tools/bulk-delete", {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Resources: studyIds }),
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      return NextResponse.json({ message: `Failed to delete studies: ${errorText}` }, { status: deleteResponse.status });
    }

    return NextResponse.json({ message: "All studies deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting studies:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
