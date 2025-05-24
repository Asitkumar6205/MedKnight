import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const caseSchema = z.object({
  doctor: z.string(),
  priority: z.enum(["Routine", "Urgent", "Stat"]),
  history: z.string(),
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
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to upload file to S3
async function uploadToS3(file: File): Promise<{ filename: string; path: string; uploadedAt: Date }> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    
    // Create the S3 key (path in bucket)
    const key = `uploads/${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_CLINICAL_HISTORY!,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
      // Optional: Set ACL to public-read if you want files to be publicly accessible
      // ACL: 'public-read',
    });

    await s3Client.send(command);

    // Construct the file URL
    const fileUrl = `https://${process.env.S3_CLINICAL_HISTORY}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
    
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

    const doctor = formData.get("doctor");
    const priority = formData.get("priority") || "Routine";
    const history = formData.get("history");
    const structuredStudiesString = formData.get("selectedStudies");
    const studyPricesString = formData.get("studyPrices");
    const totalAmountString = formData.get("totalAmount");

    if (!patientId || !doctor || !history || !patientName || !studyUID || !studyDescription || !gender || !modality || !studyDate || !studyTime || !series || !structuredStudiesString || !studyPricesString || !totalAmountString) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate AWS S3 configuration
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.S3_CLINICAL_HISTORY) {
      return NextResponse.json(
        { message: "AWS S3 configuration is missing" },
        { status: 500 }
      );
    }

    const structuredStudies = JSON.parse(structuredStudiesString as string);
    const studyPrices = JSON.parse(studyPricesString as string);
    const totalAmount = parseFloat(totalAmountString as string);

    const validatedData: CaseSchema = caseSchema.parse({
      doctor: doctor.toString(),
      priority: priority as "Routine" | "Urgent" | "Stat",
      history: history.toString(),
      structuredStudies: structuredStudies,
      studyPrices: studyPrices,
      totalAmount: totalAmount
    });

    console.log("Validated Data:", validatedData);

    // Process studies
    const studyNames = Object.keys(structuredStudies);
    const existingStudies = await db.study.findMany({
      where: { name: { in: studyNames } },
    });

    const existingStudyNames = existingStudies.map((s) => s.name);

    // Insert missing studies
    const missingStudies = studyNames
      .filter((name) => !existingStudyNames.includes(name))
      .map((name) => ({
        name,
        studyType: [],
        studyView: [],
        studySide: [],
        price: studyPrices[name] || 0,
      }));

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

      await db.study.update({
        where: { id: study.id },
        data: {
          studyType: Array.from(studyType),
          studyView: Array.from(studyView),
          studySide: Array.from(studySide),
          price: studyPrices[study.name] || study.price || 0,
        },
      });
    }

    // Get all study IDs for the new case
    const studyIds = allStudies.map((study) => ({ id: study.id }));

    // Handle file uploads to S3
    const files = formData.getAll("files") as File[];
    console.log("Number of files received:", files.length);

    const fileData = files.length > 0
      ? await Promise.all(files.map(uploadToS3))
      : [];

    console.log("File data prepared:", fileData);

    // Create a new case
    const newCase = await db.case.create({
      data: {
        patientId: patientId.toString(),
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
        activeCase: true,
        totalAmount: validatedData.totalAmount,
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