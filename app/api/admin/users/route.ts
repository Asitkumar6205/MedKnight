// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTransport } from "nodemailer";

// Helper function to send approval email
async function sendApprovalEmail(email: string, approved: boolean) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://medknight.in';
  const emailServer = process.env.EMAIL_SERVER || {
    host: process.env.EMAIL_SERVER_HOST || '',
    port: Number(process.env.EMAIL_SERVER_PORT || 587),
    auth: {
      user: process.env.EMAIL_SERVER_USER || '',
      pass: process.env.EMAIL_SERVER_PASSWORD || '',
    },
  };
  
  const from = process.env.EMAIL_FROM || 'no-reply@medknight.in';
  const { host } = new URL(baseUrl);
  
  const transport = createTransport(emailServer);
  
  const subject = approved 
    ? `Your account on ${host} has been approved` 
    : `Your account request on ${host} has been rejected`;
  
  const text = approved
    ? `Your account on ${host} has been approved. You can now sign in at ${baseUrl}/signin`
    : `We're sorry, but your account request on ${host} has been rejected. Please contact the administrator for more information.`;
  
  const html = approved
    ? `
      <body style="background: #f9f9f9;">
        <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
              <strong>Account Approved</strong>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <p>Your account on ${host} has been approved. You can now sign in with your email and password.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
                    <a href="${baseUrl}/signin" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">
                      Sign In
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `
    : `
      <body style="background: #f9f9f9;">
        <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
              <strong>Account Request Rejected</strong>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <p>We're sorry, but your account request on ${host} has been rejected. Please contact the administrator for more information.</p>
            </td>
          </tr>
        </table>
      </body>
    `;
  
  await transport.sendMail({
    to: email,
    from,
    subject,
    text,
    html,
  });
}

// GET all users (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const adminUser = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Not authorized" },
        { status: 403 }
      );
    }
    
    // Get query parameters for filtering
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    
    let whereClause = {};
    if (status) {
      whereClause = { ...whereClause, status };
    }
    if (role) {
      whereClause = { ...whereClause, role };
    }
    
    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        name: true,
        createdAt: true,
        emailVerified: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// PATCH to update user status (approve or reject)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const adminUser = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    if (!adminUser || adminUser.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Not authorized" },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const { userId, status, role } = body;
    
    if (!userId || (!status && !role)) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Get the user before updating
    const userToUpdate = await db.user.findUnique({
      where: { id: userId },
    });
    
    if (!userToUpdate) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Update user status/role
    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;
    
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });
    
    // If the user was pending and is now approved or rejected, send email
    if (userToUpdate.status === "PENDING_APPROVAL" && status) {
      await sendApprovalEmail(
        userToUpdate.email || "",
        status === "ACTIVE"
      );
    }
    
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Admin update user API error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}