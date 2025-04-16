// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    });

    // Even if user doesn't exist, we return success for security reasons
    if (!user) {
      return NextResponse.json(
        { message: "If your email is registered, you will receive a password reset link." },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    try {
      // Save reset token to database - using try/catch to handle specific database errors
      await db.passwordReset.upsert({
        where: { userId: user.id },
        update: {
          token: resetToken,
          expiresAt: tokenExpiry,
        },
        create: {
          userId: user.id,
          token: resetToken,
          expiresAt: tokenExpiry,
        },
      });
    } catch (dbError) {
      console.error("Database error during password reset:", dbError);
      
      // Try to delete any existing record and create a new one as fallback
      try {
        const existingReset = await db.passwordReset.findUnique({
          where: { userId: user.id },
        });
        
        if (existingReset) {
          await db.passwordReset.delete({
            where: { userId: user.id },
          });
        }
        
        await db.passwordReset.create({
          data: {
            userId: user.id,
            token: resetToken,
            expiresAt: tokenExpiry,
          },
        });
      } catch (fallbackError) {
        console.error("Failed to create password reset record:", fallbackError);
        return NextResponse.json(
          { message: "Error processing your request. Please try again later." },
          { status: 500 }
        );
      }
    }

    // Get base URL for reset link
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    try {
      // Send email using our enhanced email utility with better error handling
      await sendPasswordResetEmail({
        to: email,
        resetUrl,
        from: process.env.EMAIL_FROM || 'no-reply@example.com'
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return NextResponse.json(
        { message: "Could not send reset email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "If your email is registered, you will receive a password reset link." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}