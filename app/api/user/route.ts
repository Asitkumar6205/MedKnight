// app/api/user/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { createTransport } from "nodemailer";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const signInSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  userType: z.enum(["RADIOLOGIST", "HOSPITAL"], {
    required_error: "User type is required",
  }),
});

async function sendVerificationEmail(email: string, token: string, userData: { username: string, password: string, userType: string }) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://medknight.in';
  // Store user data in the token query params (encrypted as JSON)
  const userDataParam = Buffer.from(JSON.stringify(userData)).toString('base64');
  
  const url = `${baseUrl}/api/verify-email?token=${token}&email=${encodeURIComponent(email)}&data=${userDataParam}`;
  
  const emailServer = process.env.EMAIL_SERVER || {
    host: process.env.EMAIL_SERVER_HOST || '',
    port: Number(process.env.EMAIL_SERVER_PORT || 465),
    auth: {
      user: process.env.EMAIL_SERVER_USER || '',
      pass: process.env.EMAIL_SERVER_PASSWORD || '',
    },
  };
  
  const from = process.env.EMAIL_FROM || 'noreply@example.com';
  const { host } = new URL(url);
  
  const transport = createTransport(emailServer);
  
  const userTypeDisplay = userData.userType === 'RADIOLOGIST' ? 'Radiologist' : 'Hospital';
  
  await transport.sendMail({
    to: email,
    from,
    subject: `Verify your email for ${host}`,
    text: `Please verify your email for ${host}\n${url}\n\n`,
    html: `
      <body style="background: #f9f9f9;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
              <strong>${host}</strong>
            </td>
          </tr>
        </table>
        <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
              Verify your email: <strong>${email.replace(/\./g, "&#8203;.")}</strong>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0px 0px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #666666;">
              Account Type: <strong>${userTypeDisplay}</strong>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
                    <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
              If you did not request this email you can safely ignore it.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0px 0px 0px; font-size: 14px; font-family: Helvetica, Arial, sans-serif; color: #666666;">
              <p>Note: After verifying your email, an administrator will need to approve your ${userTypeDisplay.toLowerCase()} account before you can sign in.</p>
            </td>
          </tr>
        </table>
      </body>
    `,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, userType } = signInSchema.parse(body);

    // Check if username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, error: "username_exists", message: "User with this Username already exists" },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, error: "email_exists", message: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Create a verification token
    const token = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    // Store user data temporarily in the verification token
    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
    
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Send verification email with the token and user data
    await sendVerificationEmail(email, token, { 
      username,
      password: hashedPassword, // Send the already hashed password
      userType
    });

    const userTypeDisplay = userType === 'RADIOLOGIST' ? 'radiologist' : 'hospital';

    return NextResponse.json(
      { message: `Verification email sent. Please check your inbox to complete registration. Once verified, an administrator will need to approve your ${userTypeDisplay} account before you can sign in.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Delete the user from the database
    await db.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      { message: "User rejected and deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error rejecting user:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}