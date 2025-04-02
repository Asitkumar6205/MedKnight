// api/radiologist/postuser/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

// Define schema validation for radiologist submission - without File validation
const radiologistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  qualifications: z.string().min(2, "Qualifications must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  mrn: z.string().min(2, "MRN must be at least 2 characters"),
  isDefault: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    // Get form data
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const qualifications = formData.get("qualifications") as string;
    const designation = formData.get("designation") as string;
    const mrn = formData.get("mrn") as string;
    const isDefault = formData.get("isDefault") === "true";
    const signature = formData.get("signature");

    // Validate data (excluding the signature file)
    const validationResult = radiologistSchema.safeParse({
      name,
      email,
      phone,
      qualifications,
      designation,
      mrn,
      isDefault,
    });

    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error.format());
      return NextResponse.json(
        { message: "Invalid input data", errors: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Check if signature exists
    if (!signature) {
      return NextResponse.json(
        { message: "Signature file is required" },
        { status: 400 }
      );
    }

    // Manual validation for signature size
    // For FormData, signature could be File or Blob
    let fileSize = 0;
    let fileName = "signature.png"; // Default name

    if (signature instanceof Blob) {
      fileSize = signature.size;
      // Try to get the name if available
      if ('name' in signature) {
        fileName = (signature as any).name;
      }
    }

    // Check file size (5MB limit)
    if (fileSize > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Signature must be less than 5MB" },
        { status: 400 }
      );
    }

    // Handle file upload
    const bytes = await (signature as Blob).arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public/uploads/signatures");
    await mkdir(uploadDir, { recursive: true });

    const uniqueFileName = `${Date.now()}-${fileName}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    const publicPath = `/uploads/signatures/${uniqueFileName}`;

    // Write file to disk
    await writeFile(filePath, buffer);

    // First create the radiologist
    const newRadiologist = await db.radiologist.create({
      data: {
        name,
        email,
        phone,
        qualifications,
        designation,
        mrn,
        isDefault: isDefault || false,
      },
    });

    // Then create the signature linked to the radiologist
    const newSignature = await db.signature.create({
      data: {
        filename: uniqueFileName,
        path: publicPath,
        radiologistId: newRadiologist.id,
      },
    });

    console.log("Radiologist created:", newRadiologist);
    console.log("Signature created:", newSignature);

    return NextResponse.json(
      { 
        radiologist: {
          ...newRadiologist,
          signature: newSignature
        }, 
        message: "Radiologist created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { 
        message: "Something went wrong", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}