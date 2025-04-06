// app/api/saveReport/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const radiologistName = formData.get("radiologist") as string;
    const file = formData.get("file") as File;
    const patientId = formData.get("patientId") as string;

    if (!file || !patientId) {
      return NextResponse.json(
        { error: "Missing file or patientId" },
        { status: 400 }
      );
    }

    // Find the case by patientId
    const existingCase = await prisma.case.findUnique({
      where: { patientId },
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    // Create reports directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "reports");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.log("Directory already exists or cannot be created");
    }

    // Create a unique filename
    const fileName = `report_${patientId}_${Date.now()}.pdf`;
    const filePath = path.join(uploadDir, fileName);
    
    // Convert the file to a Buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Create a public path for the file
    const publicPath = `/reports/${fileName}`;

    // Check if there's an existing report for this case
    const existingReport = await prisma.report.findFirst({
      where: { caseId: existingCase.id },
    });

    let report;
    
    if (existingReport) {
      // Update existing report
      report = await prisma.report.update({
        where: { id: existingReport.id },
        data: {
          filename: fileName,
          path: publicPath,
          uploadedAt: new Date(),
        },
      });
    } else {
      // Create new report
      report = await prisma.report.create({
        data: {
          filename: fileName,
          path: publicPath,
          caseId: existingCase.id,
        },
      });
    }

    // Update the case to mark it as completed
    const updatedCase = await prisma.case.update({
      where: { id: existingCase.id },
      data: {
        completedCase: true,
        radiologist: radiologistName
      },
    });

    return NextResponse.json({
      success: true,
      message: "Report saved successfully",
      report,
      case: updatedCase,
    });
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}