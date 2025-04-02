import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const caseUpdateSchema = z.object({
  doctor: z.string(),
  priority: z.enum(["Routine", "Urgent", "Stat"]),
  history: z.string(),
  structuredStudies: z.record(
    z.string(),
    z.record(z.string(), z.record(z.string(), z.array(z.string())))
  ),
});

type CaseUpdateSchema = z.infer<typeof caseUpdateSchema>;

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const patientId = formData.get("patientId")?.toString();

    if (!patientId) {
      return NextResponse.json(
        { message: "Patient ID is required" },
        { status: 400 }
      );
    }

    // Check if the case exists
    const existingCase = await db.active.findUnique({
      where: { patientId },
      include: {
        studies: true,
        files: true,
      },
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    const doctor = formData.get("doctor");
    const priority = formData.get("priority") || "Routine";
    const history = formData.get("history");
    const structuredStudiesString = formData.get("selectedStudies");

    if (!doctor || !history || !structuredStudiesString) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const structuredStudies = JSON.parse(structuredStudiesString as string);

    const validatedData: CaseUpdateSchema = caseUpdateSchema.parse({
      doctor: doctor.toString(),
      priority: priority as "Routine" | "Urgent" | "Stat",
      history: history.toString(),
      structuredStudies,
    });

    console.log("Validated Update Data:", validatedData);

    // Process studies
    const studyNames = Object.keys(structuredStudies);
    
    // First, disconnect all existing studies from the case
    await db.active.update({
      where: { id: existingCase.id },
      data: {
        studies: {
          disconnect: existingCase.studies.map(study => ({ id: study.id })),
        },
      },
    });

    // Process each study and connect to the case
    const caseStudies = [];
    
    for (const studyName of studyNames) {
      const studyData = structuredStudies[studyName];
      
      // Check if the study exists
      let study = await db.study.findFirst({
        where: { name: studyName },
      });
      
      // Extract selected options from the structured data
      const selectedTypes = new Set();
      const selectedViews = new Set();
      const selectedSides = new Set();
      
      Object.entries(studyData).forEach(([field, valuesObj]) => {
        if (typeof valuesObj === "object" && valuesObj !== null) {
          Object.keys(valuesObj).forEach((value) => {
            if (field === "Select Type") selectedTypes.add(value);
            if (field === "Select View") selectedViews.add(value);
            if (field === "Select Side") selectedSides.add(value);
          });
        }
      });
      
      // Create the study if it doesn't exist
      if (!study) {
        study = await db.study.create({
          data: {
            name: studyName,
            studyType: Array.from(selectedTypes) as string[],
            studyView: Array.from(selectedViews) as string[],
            studySide: Array.from(selectedSides) as string[],
          },
        });
      } 
      // Update the existing study with new selections
      else {
        study = await db.study.update({
          where: { id: study.id },
          data: {
            studyType: Array.from(selectedTypes) as string[],
            studyView: Array.from(selectedViews) as string[],
            studySide: Array.from(selectedSides) as string[],
          },
        });
      }
      
      caseStudies.push({ id: study.id });
    }

    // Create upload directory if not exists
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Handle file uploads
    const files = formData.getAll("files") as File[];
    console.log("Number of new files received:", files.length);

    const fileData =
      files.length > 0
        ? await Promise.all(
            files.map(async (file) => {
              try {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uniqueSuffix = `${Date.now()}-${Math.round(
                  Math.random() * 1e9
                )}`;
                const filename = `${uniqueSuffix}-${file.name}`;
                const filePath = join(uploadDir, filename);

                await writeFile(filePath, buffer);
                console.log("File saved:", filename);

                return {
                  filename: file.name,
                  path: `/uploads/${filename}`,
                  uploadedAt: new Date(),
                };
              } catch (error) {
                console.error("Error processing file:", error);
                throw error;
              }
            })
          )
        : [];

    console.log("New file data prepared:", fileData);

    // Update the case with new data and connect the updated studies
    const updatedCase = await db.active.update({
      where: { id: existingCase.id },
      data: {
        doctor: validatedData.doctor,
        priority: validatedData.priority,
        history: validatedData.history,
        studies: {
          connect: caseStudies,
        },
        ...(fileData.length > 0 && {
          files: {
            create: fileData,
          },
        }),
        updatedAt: new Date(),
      },
      include: {
        files: true,
        studies: true,
      },
    });

    console.log("Case updated:", updatedCase);

    return NextResponse.json(
      { case: updatedCase, message: "Case updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT handler:", error);
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