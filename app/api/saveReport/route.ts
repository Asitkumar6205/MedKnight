// app/api/saveReport/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const radiologistName = formData.get("radiologist") as string;
    const file = formData.get("file") as File;
    const patientId = formData.get("patientId") as string;
    const reportDT = formData.get("reportDT") as string;

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

    // Create a unique filename
    const fileName = `report_${patientId}_${Date.now()}.pdf`;
    
    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to S3
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME || 'your-bucket-name',
        Key: `reports/${fileName}`,
        Body: buffer,
        ContentType: 'application/pdf',
      }));
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);
      return NextResponse.json(
        { error: `Failed to upload file to S3: ${s3Error}` },
        { status: 500 }
      );
    }

    // Generate the public URL for the file
    const publicPath = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/reports/${fileName}`;
    // Alternative if using CloudFront or custom domain:
    // const publicPath = `${process.env.CLOUD_STORAGE_URL}/reports/${fileName}`;

    // Check if there's an existing report for this case
    const existingReport = await prisma.report.findFirst({
      where: { caseId: existingCase.id },
    });

    let report;
    
    try {
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
            uploadedAt: new Date(),
          },
        });
      }

      // Update the case to mark it as completed
      const updatedCase = await prisma.case.update({
        where: { id: existingCase.id },
        data: {
          completedCase: true,
          radiologist: radiologistName || null,
          reportTime: reportDT || null,
          reviewCase: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Report saved successfully",
        report,
        case: updatedCase,
      });
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);
      return NextResponse.json(
        { error: `Database operation failed: ${prismaError}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json(
      { error: `Failed to save report: ${error || 'Unknown error'}` },
      { status: 500 }
    );
  }
}