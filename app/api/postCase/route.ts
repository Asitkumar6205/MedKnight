// app/api/postCase/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const caseSchema = z.object({
  patientAge: z.string(),
  patientContactNo: z.string(),
  doctor: z.string(),
  priority: z.enum(["Routine", "Urgent", "Stat"]),
  history: z.string(),
  hospitalId: z.string(),
  structuredStudies: z.record(
    z.string(),
    z.record(z.string(), z.record(z.string(), z.array(z.string())))
  ),
  studyPrices: z.record(z.string(), z.number()),
  totalAmount: z.number(),
});

type CaseSchema = z.infer<typeof caseSchema>;

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to upload file to S3
async function uploadToS3(
  file: File
): Promise<{ filename: string; path: string; uploadedAt: Date }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;

    const key = `uploads/${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_CLINICAL_HISTORY!,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    });

    await s3Client.send(command);

    const fileUrl = `https://${process.env.S3_CLINICAL_HISTORY}.s3.${
      process.env.AWS_REGION || "us-east-1"
    }.amazonaws.com/${key}`;

    console.log("File uploaded to S3:", filename);

    return {
      filename: file.name,
      path: fileUrl,
      uploadedAt: new Date(),
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    // Get user session to determine hospitalId
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user and their hospital
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    });

    if (!user || user.role !== 'HOSPITAL') {
      return NextResponse.json(
        { message: "Access denied. Hospital role required." },
        { status: 403 }
      );
    }

    // Find hospital by user's email (assuming hospital email matches user email)
    const hospital = await db.hospital.findUnique({
      where: { email: session.user.email }
    });

    if (!hospital) {
      return NextResponse.json(
        { message: "Hospital not found. Please complete hospital setup first." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const patientId = formData.get("patientId")?.toString();
    const studyUID = formData.get("studyUID")?.toString();
    const patientName = formData.get("patientName")?.toString();
    const studyDescription = formData.get("studyDescription")?.toString();
    const gender = formData.get("gender")?.toString();
    const modality = formData.get("modality")?.toString();
    const studyDate = formData.get("studyDate")?.toString();
    const studyTime = formData.get("studyTime")?.toString();
    const series = formData.get("series")?.toString();
    const images = formData.get("images")?.toString();

    // Use hospitalId from the authenticated user's hospital
    const hospitalId = hospital.id;

    // Check if a case with the same patientId already exists
    const existingCase = await db.case.findUnique({
      where: { patientId },
    });

    if (existingCase) {
      return NextResponse.json(
        { error: "This Patient ID already exists" },
        { status: 400 }
      );
    }
    
    const patientAge = formData.get("patientAge");
    const patientContactNo = formData.get("patientContactNo");
    const doctor = formData.get("doctor");
    const priority = formData.get("priority") || "Routine";
    const history = formData.get("history");
    const structuredStudiesString = formData.get("selectedStudies");
    const studyPricesString = formData.get("studyPrices");
    const totalAmountString = formData.get("totalAmount");
    const studyMetadataString = formData.get("studyMetadata");

    if (
      !patientId ||
      !patientAge ||
      !images ||
      !patientContactNo ||
      !doctor ||
      !history ||
      !patientName ||
      !studyUID ||
      !studyDescription ||
      !gender ||
      !modality ||
      !studyDate ||
      !studyTime ||
      !series ||
      !structuredStudiesString ||
      !studyPricesString ||
      !totalAmountString ||
      !studyMetadataString
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate AWS S3 configuration
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.S3_CLINICAL_HISTORY
    ) {
      return NextResponse.json(
        { message: "AWS S3 configuration is missing" },
        { status: 500 }
      );
    }

    const structuredStudies = JSON.parse(structuredStudiesString as string);
    const studyPrices = JSON.parse(studyPricesString as string);
    const totalAmount = parseFloat(totalAmountString as string);
    const studyMetadata = JSON.parse(studyMetadataString as string);

    const validatedData: CaseSchema = caseSchema.parse({
      patientAge: patientAge.toString(),
      patientContactNo: patientContactNo.toString(),
      doctor: doctor.toString(),
      priority: priority as "Routine" | "Urgent" | "Stat",
      history: history.toString(),
      hospitalId: hospitalId, // Use hospitalId from authenticated user
      structuredStudies: structuredStudies,
      studyPrices: studyPrices,
      totalAmount: totalAmount,
    });

    console.log("Validated Data:", validatedData);

    // Process studies (existing code remains the same)
    const studyNames = Object.keys(structuredStudies);
    const existingStudies = await db.study.findMany({
      where: { name: { in: studyNames } },
    });

    const existingStudyNames = existingStudies.map((s) => s.name);

    // Insert missing studies
    const missingStudies = studyNames
      .filter((name) => !existingStudyNames.includes(name))
      .map((name) => {
        const metadata = studyMetadata[name] || {};
        const qualifications = metadata.qualifications ?? "";
        const subspeciality = metadata.subspeciality ?? "";

        return {
          name,
          studyType: [],
          studyView: [],
          studySide: [],
          price: studyPrices[name] || 0,
          qualifications: qualifications,
          subspeciality: subspeciality,
        };
      });

    if (missingStudies.length > 0) {
      await db.study.createMany({ data: missingStudies });
    }

    // Fetch updated list of all studies
    const allStudies = await db.study.findMany({
      where: { name: { in: studyNames } },
    });

    // Process study updates
    for (const study of allStudies) {
      const studyData = structuredStudies[study.name];

      let studyType = new Set(study.studyType || []);
      let studyView = new Set(study.studyView || []);
      let studySide = new Set(study.studySide || []);

      Object.entries(studyData).forEach(([field, valuesObj]) => {
        if (typeof valuesObj === "object" && valuesObj !== null) {
          Object.keys(valuesObj).forEach((value) => {
            if (field === "Select Type") studyType.add(value);
            if (field === "Select View") studyView.add(value);
            if (field === "Select Side") studySide.add(value);
          });
        } else {
          console.warn(`Unexpected value for ${field}:`, valuesObj);
        }
      });

      const metadata = studyMetadata[study.name] || {};
      const qualifications = metadata.qualifications ?? "";
      const subspeciality = metadata.subspeciality ?? "";

      await db.study.update({
        where: { id: study.id },
        data: {
          studyType: Array.from(studyType),
          studyView: Array.from(studyView),
          studySide: Array.from(studySide),
          price: studyPrices[study.name] || study.price || 0,
          qualifications: qualifications,
          subspeciality: subspeciality,
        },
      });
    }

    // Get all study IDs for the new case
    const studyIds = allStudies.map((study) => ({ id: study.id }));

    // Handle file uploads to S3
    const files = formData.getAll("files") as File[];
    console.log("Number of files received:", files.length);

    const fileData =
      files.length > 0 ? await Promise.all(files.map(uploadToS3)) : [];

    console.log("File data prepared:", fileData);

    // Create a new case with hospitalId
    const currentTime = new Date();
    
    const newCase = await db.case.create({
      data: {
        patientId: patientId.toString(),
        patientAge: validatedData.patientAge,
        patientContactNo: validatedData.patientContactNo,
        studyUID: studyUID,
        doctor: validatedData.doctor,
        priority: validatedData.priority,
        history: validatedData.history,
        patientName: patientName.toString(),
        studyDescription: studyDescription,
        gender: gender,
        modality: modality,
        studyDate: studyDate,
        studyTime: studyTime,
        series: series,
        images: images,
        activeCase: true,
        totalAmount: validatedData.totalAmount,
        caseUploadTime: currentTime.toISOString(),
        hospitalId: validatedData.hospitalId,
        studies: {
          connect: studyIds,
        },
        ...(fileData.length > 0 && {
          files: {
            create: fileData,
          },
        }),
      },
      include: {
        files: true,
        studies: true,
        hospital: true,
      },
    });

    console.log("Case created with files:", newCase);

    return NextResponse.json(
      { case: newCase, message: "Case created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "Something went wrong",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}