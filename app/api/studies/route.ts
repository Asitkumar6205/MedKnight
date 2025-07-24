import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db"; // Import your Prisma client

export async function GET() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.username) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const auth =
      "Basic " +
      Buffer.from(
        `${process.env.SERVER_USERNAME}:${process.env.SERVER_PASSWORD}`
      ).toString("base64");

    const response = await fetch(`${process.env.BASE_URL}/tools/find`, {
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
          "InstitutionName",
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

    // Filter studies based on institution name matching username
    const filteredStudies = studies.filter(study => {
      const institutionName = study.MainDicomTags?.InstitutionName;
      return institutionName === session.user.username;
    });

    if (filteredStudies.length === 0) {
      return NextResponse.json(
        { message: "No studies found for your institution" },
        { status: 404 }
      );
    }

    // Get all patientIds from filtered studies
    const patientIds = filteredStudies
      .map(study => study.PatientMainDicomTags?.PatientID)
      .filter(Boolean); // Remove null/undefined values

    // Query database to check which patientIds exist in Case table
    const existingCases = await db.case.findMany({
      where: {
        patientId: {
          in: patientIds
        }
      },
      select: {
        patientId: true
      }
    });

    // Create a Set for quick lookup
    const existingPatientIds = new Set(existingCases.map(c => c.patientId));

    // Fetch statistics for each filtered study to get CountInstances
    const studiesWithInstances = await Promise.all(
      filteredStudies.map(async (study) => {
        let countInstances = 0;
        let remoteAET = "Unknown";
        const patientId = study.PatientMainDicomTags?.PatientID || "N/A";

        try {
          // Fetch statistics for this specific study
          const statsResponse = await fetch(
            `${process.env.BASE_URL}/studies/${study.ID}/statistics`,
            {
              method: "GET",
              headers: {
                Authorization: auth,
                "Content-Type": "application/json",
              },
            }
          );

          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            countInstances = stats.CountInstances || 0;
          }
        } catch (error) {
          console.error(
            `Error fetching statistics for study ${study.ID}:`,
            error
          );
        }

        try {
          // Fetch full metadata to get RemoteAET
          const metaResponse = await fetch(
            `${process.env.BASE_URL}/studies/${study.ID}`,
            {
              method: "GET",
              headers: {
                Authorization: auth,
                "Content-Type": "application/json",
              },
            }
          );

          if (metaResponse.ok) {
            const meta = await metaResponse.json();
            remoteAET = meta.RemoteAET || "Unknown";
          }
        } catch (error) {
          console.error(
            `Error fetching metadata for study ${study.ID}:`,
            error
          );
        }

        return {
          PatientName: study.PatientMainDicomTags?.PatientName || "N/A",
          PatientID: patientId,
          InstitutionName: study.MainDicomTags?.InstitutionName || "N/A",
          StudyInstanceUID: study.MainDicomTags?.StudyInstanceUID || "N/A",
          StudyDescription: study.MainDicomTags?.StudyDescription || "N/A",
          PatientSex: study.PatientMainDicomTags?.PatientSex || "N/A",
          StudyDate: study.MainDicomTags?.StudyDate || "N/A",
          StudyTime: study.MainDicomTags?.StudyTime || "N/A",
          ID: study.ID || "N/A",
          Modality: study.RequestedTags?.Modality || "N/A",
          Series: study.Series ? study.Series.length : 0,
          CountInstances: countInstances,
          // Add the isActiveCase flag based on database check
          isActiveCase: existingPatientIds.has(patientId)
        };
      })
    );

    return NextResponse.json(studiesWithInstances, { status: 200 });
  } catch (error) {
    console.error("Error fetching studies:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}