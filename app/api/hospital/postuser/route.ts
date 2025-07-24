import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Adjust path as needed

// Define schema validation for user submission (hospitalId is now optional)
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  isDefault: z.boolean().optional(),
  hospitalId: z.string().optional(), // Made optional since we'll extract it
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received Data:", body);

    // Get session to extract user email
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized - No valid session found" },
        { status: 401 }
      );
    }

    // Validate request data
    const parsedData = userSchema.safeParse(body);
    if (!parsedData.success) {
      console.error("Validation Error:", parsedData.error.format());
      return NextResponse.json(
        { message: "Invalid input data", errors: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, isDefault } = parsedData.data;

    // Find hospital by matching session user email with hospital email
    const hospital = await db.hospital.findUnique({
      where: { email: session.user.email },
    });

    if (!hospital) {
      return NextResponse.json(
        { message: "Hospital not found for the current user" },
        { status: 404 }
      );
    }

    const hospitalId = hospital.id;
    console.log("Found hospital ID:", hospitalId);

    // Check for existing email or phone
    const existingUser = await db.hospitalUser.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "User with this email or phone already exists",
          field: existingUser.email === email ? "email" : "phone",
        },
        { status: 400 }
      );
    }

    // Create the user with extracted hospital ID
    const newUser = await db.hospitalUser.create({
      data: {
        name,
        email,
        phone,
        isDefault: isDefault || false,
        hospitalId, // Using the extracted hospital ID
      },
    });

    console.log("User created:", newUser);

    return NextResponse.json(
      { user: newUser, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error);

    // Handle Prisma unique constraint error
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { message: "User with this email or phone already exists" },
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