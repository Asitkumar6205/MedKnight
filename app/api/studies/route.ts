import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auth = "Basic " + Buffer.from(`${process.env.USERNAME}:${process.env.PASSWORD}`).toString("base64");

    const response = await fetch("https://archive-x1r8.medknight.in/tools/find", {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Level: "Studies",
        Expand: true,
        Query: {},
        RequestedTags: [
          "PatientName",
          "PatientID",
          "StudyDescription",
          "StudyDate",
          "StudyTime",
          "Modality",
          "NumberOfStudyRelatedSeries",
        ],
      }),
    });

    const studies = await response.json();

    if (!Array.isArray(studies) || studies.length === 0) {
      return NextResponse.json(
        { message: "No studies found" },
        { status: 404 }
      );
    }

    // Map response to correct format
    const formattedStudies = studies.map((study) => ({
      PatientName: study.PatientMainDicomTags?.PatientName || "N/A",
      PatientID: study.PatientMainDicomTags?.PatientID || "N/A",
      StudyDescription: study.MainDicomTags?.StudyDescription || "N/A",
      PatientSex: study.PatientMainDicomTags?.PatientSex || "N/A",
      StudyDate: study.MainDicomTags?.StudyDate || "N/A",
      StudyTime: study.MainDicomTags?.StudyTime || "N/A",
      ID: study.ID || "N/A",
      Modality: study.RequestedTags?.Modality || "N/A",
      Series: study.Series ? study.Series.length : 0,
    }));

    return NextResponse.json(formattedStudies, { status: 200 });
  } catch (error) {
    console.error("Error fetching studies:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
