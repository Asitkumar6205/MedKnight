import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auth = "Basic " + Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString("base64");

    const response = await fetch("http://localhost:8042/patients", {
      method: "GET",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
    });

    const studies = await response.json();

    console.log("Orthanc Response:", studies); // Debugging log

    if (!Array.isArray(studies) || studies.length === 0) {
      return NextResponse.json({ message: "No studies found" }, { status: 404 });
    }

    return NextResponse.json(studies, { status: 200 });
  } catch (error) {
    console.error("Error fetching studies:", error);
    return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
  }
}
