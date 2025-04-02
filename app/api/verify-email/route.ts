// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const encodedData = searchParams.get('data');
    
    if (!token || !email || !encodedData) {
      return NextResponse.redirect(new URL('/error?message=Invalid verification link', req.url));
    }
    
    // Find the verification token
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        token,
        identifier: email,
        expires: {
          gt: new Date(),
        },
      },
    });
    
    if (!verificationToken) {
      return NextResponse.redirect(new URL('/error?message=Invalid or expired verification link', req.url));
    }
    
    // Decode user data
    const userData = JSON.parse(Buffer.from(encodedData, 'base64').toString());
    
    // Check if user already exists (might have been created in a race condition)
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      // If user exists but not verified, mark as verified
      if (!existingUser.emailVerified) {
        await db.user.update({
          where: { email },
          data: { emailVerified: new Date() },
        });
      }
    } else {
      // Create the user with verified email
      await db.user.create({
        data: {
          username: userData.username,
          email: email,
          password: userData.password, // Already hashed from previous step
          emailVerified: new Date(),
        },
      });
    }
    
    // Delete the verification token
    await db.verificationToken.delete({
      where: { 
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        }
      },
    });
    
    // Redirect to login page with success message
    return NextResponse.redirect(new URL('/signin?verified=true', req.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL('/error?message=Verification failed', req.url));
  }
}