import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";
import Jimp from "jimp";
import potrace from "potrace";

// Define schema validation for radiologist submission - with qualifications as array
const radiologistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  subspeciality: z.string().min(2, "Subspeciality must be at least 2 characters"),
  qualifications: z.array(z.string()).min(1, "At least one qualification is required"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  mrn: z.string().min(2, "MRN must be at least 2 characters"),
});

// Function to convert image buffer to SVG
async function convertImageToSVG(
  imageBuffer: Buffer,
  options = {
    threshold: 128,
    color: '#000000',
    background: 'transparent',
    turdSize: 2,
    alphaMax: 1,
    optCurve: true,
    optTolerance: 0.2,
  }
): Promise<string | null> {
  try {
    // Load the image with Jimp
    const image = await Jimp.read(imageBuffer);
    
    // Process the image to enhance signature quality
    image
      .grayscale()
      .contrast(0.3)
      .threshold({ max: 255, replace: 255, autoGreyscale: false })
      .invert();
    
    // Get the processed image as buffer
    const processedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
    // Convert to SVG using potrace
    return new Promise((resolve, reject) => {
      potrace.trace(processedBuffer, options, (err, svg) => {
        if (err || !svg) {
          console.error('Error tracing image:', err);
          resolve(null);
        } else {
          resolve(svg);
        }
      });
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}

// Helper function to parse qualifications from form data
function parseQualifications(qualificationsData: FormDataEntryValue | null): string[] {
  if (!qualificationsData) {
    return [];
  }

  const qualificationsStr = qualificationsData.toString();
  
  try {
    // Try to parse as JSON array first (if sent as JSON)
    const parsed = JSON.parse(qualificationsStr);
    if (Array.isArray(parsed)) {
      return parsed.filter(q => typeof q === 'string' && q.trim().length > 0);
    }
  } catch (e) {
    // If JSON parsing fails, treat as comma-separated string or single value
  }

  // Handle comma-separated string or single value
  return qualificationsStr
    .split(',')
    .map(q => q.trim())
    .filter(q => q.length > 0);
}

export async function POST(req: Request) {
  try {
    console.log("POST request received");
    
    // Get form data
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const subspeciality = formData.get("subspeciality") as string;
    const qualificationsRaw = formData.get("qualifications");
    const designation = formData.get("designation") as string;
    const mrn = formData.get("mrn") as string;
    const signature = formData.get("signature");
    
    console.log("Form data received:", {
      name, email, phone, subspeciality, 
      qualificationsRaw: qualificationsRaw?.toString(),
      designation, mrn,
      hasSignature: !!signature
    });
    
    // Parse qualifications into array - this will always return string[]
    const qualifications = parseQualifications(qualificationsRaw);
    
    console.log("Parsed qualifications:", qualifications);
    
    // Check if SVG version was provided directly
    const signatureSvg = formData.get("signatureSvg");
    const svgData = formData.get("svgData") as string;

    // Validate data (with qualifications as array)
    const validationResult = radiologistSchema.safeParse({
      name,
      email,
      phone,
      subspeciality,
      qualifications,
      designation,
      mrn,
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
      console.error("No signature file provided");
      return NextResponse.json(
        { message: "Signature file is required" },
        { status: 400 }
      );
    }

    // Manual validation for signature size
    let fileSize = 0;
    let fileName = "signature.png";

    if (signature instanceof Blob) {
      fileSize = signature.size;
      if ('name' in signature) {
        fileName = (signature as any).name;
      }
    }

    console.log("Signature file details:", { fileSize, fileName });

    // Check file size (5MB limit)
    if (fileSize > 5 * 1024 * 1024) {
      console.error("File too large:", fileSize);
      return NextResponse.json(
        { message: "Signature must be less than 5MB" },
        { status: 400 }
      );
    }

    // Handle original signature file upload
    const bytes = await (signature as Blob).arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public/uploads/signatures");
    await mkdir(uploadDir, { recursive: true });

    const uniqueFileName = `${Date.now()}-${fileName}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    const publicPath = `/uploads/signatures/${uniqueFileName}`;

    console.log("Writing file to:", filePath);

    // Write original file to disk
    await writeFile(filePath, buffer);

    // Handle SVG generation/saving
    let svgFileName = null;
    let svgPublicPath = null;
    
    if (svgData) {
      svgFileName = `${Date.now()}-signature.svg`;
      svgPublicPath = `/uploads/signatures/${svgFileName}`;
      const svgFilePath = path.join(uploadDir, svgFileName);
      await writeFile(svgFilePath, svgData);
      console.log("SVG data written to:", svgFilePath);
    }
    else if (signatureSvg instanceof Blob) {
      const svgBytes = await signatureSvg.arrayBuffer();
      const svgBuffer = Buffer.from(svgBytes);
      svgFileName = `${Date.now()}-${(signatureSvg as any).name || 'signature.svg'}`;
      svgPublicPath = `/uploads/signatures/${svgFileName}`;
      const svgFilePath = path.join(uploadDir, svgFileName);
      await writeFile(svgFilePath, svgBuffer);
      console.log("SVG blob written to:", svgFilePath);
    } 
    else {
      console.log("Converting image to SVG...");
      const svg = await convertImageToSVG(buffer);
      if (svg) {
        svgFileName = `${Date.now()}-signature.svg`;
        svgPublicPath = `/uploads/signatures/${svgFileName}`;
        const svgFilePath = path.join(uploadDir, svgFileName);
        await writeFile(svgFilePath, svg);
        console.log("Converted SVG written to:", svgFilePath);
      } else {
        console.warn("Failed to convert image to SVG");
      }
    }

    console.log("Starting database transaction...");

    // Use a transaction to ensure both operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // First create the radiologist
      console.log("Creating radiologist with data:", {
        name, email, phone, subspeciality, qualifications, designation, mrn
      });
      
      const newRadiologist = await tx.radiologist.create({
        data: {
          name,
          email,
          phone,
          subspeciality,
          qualifications: qualifications,
          designation,
          mrn,
        },
      });

      console.log("Radiologist created:", newRadiologist.id);

      // Then create the signature linked to the radiologist
      const newSignature = await tx.signature.create({
        data: {
          filename: uniqueFileName,
          path: publicPath,
          svgPath: svgPublicPath as string,
          radiologistId: newRadiologist.id,
        },
      });

      console.log("Signature created:", newSignature.id);

      // Check if a user with this email already exists
      let updatedUser = null;
      const existingUser = await tx.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log("Updating existing user:", existingUser.id);
        // Update existing user with qualifications and subspeciality
        updatedUser = await tx.user.update({
          where: { email },
          data: {
            qualifications,
            subspeciality,
            name: name,
          },
        });
      } else {
        console.log("Creating new user");
        // Create new user with qualifications and subspeciality
        updatedUser = await tx.user.create({
          data: {
            email,
            name,
            qualifications,
            subspeciality,
            role: 'PENDING',
            status: 'PENDING_APPROVAL',
          },
        });
      }

      console.log("User operation completed:", updatedUser.id);

      return {
        radiologist: newRadiologist,
        signature: newSignature,
        user: updatedUser,
      };
    });

    console.log("Transaction completed successfully");
    console.log("Radiologist created:", result.radiologist);
    console.log("Signature created:", result.signature);
    console.log("User updated/created:", result.user);

    return NextResponse.json(
      { 
        radiologist: {
          ...result.radiologist,
          signature: result.signature
        },
        user: result.user,
        message: "Radiologist and user created/updated successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        message: "Something went wrong", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}