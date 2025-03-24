import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from "zod";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const caseSchema = z.object({
  doctor: z.string(),
  priority: z.enum(["Routine", "Urgent", "Stat"]),
  history: z.string(),
  structuredStudies: z.record(
    z.string(),
    z.record(z.string(), z.record(z.string(), z.array(z.string())))
  ),
});

type CaseSchema = z.infer<typeof caseSchema>;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Extract form data
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

    const validatedData: CaseSchema = caseSchema.parse({
      doctor: doctor.toString(),
      priority: priority as "Routine" | "Urgent" | "Stat",
      history: history.toString(),
      structuredStudies,
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
        },
      });
    }

    // Get all study IDs for the new case
    const studyIds = allStudies.map((study) => ({ id: study.id }));

    // Create upload directory if not exists
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Handle file uploads
    const files = formData.getAll("files") as File[];
    console.log("Number of files received:", files.length);

    const fileData = files.length > 0 
    ? await Promise.all(
        files.map(async (file) => {
          try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
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

    console.log("File data prepared:", fileData);

    // Create a new case
    const newCase = await db.active.create({
      data: {
        doctor: validatedData.doctor,
        priority: validatedData.priority,
        history: validatedData.history,
        studies: {
          connect: studyIds,
        },
        ...(fileData.length > 0 && {
          files: {
            create: fileData,
          }
        })
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
      { message: "Something went wrong", error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
