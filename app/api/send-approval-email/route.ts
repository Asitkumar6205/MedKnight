// app/api/send-approval-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../lib/auth";

export async function POST(request: Request) {
  // Verify admin access
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { userEmail, userName, role } = await request.json();

    if (!userEmail) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: `"MedKnight" <${process.env.EMAIL_SERVER_USER}>`,
      to: userEmail,
      subject: 'Your MedKnight Account Has Been Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h2 style="color: #333;">Account Approved</h2>
          </div>
          <div style="padding: 20px; border: 1px solid #eee; background-color: white;">
            <p>Hello ${userName},</p>
            <p>Good news! Your MedKnight account has been approved by our administrators.</p>
            <p>You have been assigned the role of <strong>${role}</strong>.</p>
            <p>You can now sign in to your account and start using our platform.</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/signin" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Sign In Now</a>
            </div>
            <p>If you have any questions or need assistance, please contact our support team.</p>
            <p>Thank you for choosing MedKnight!</p>
          </div>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>© ${new Date().getFullYear()} MedKnight. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send approval email' },
      { status: 500 }
    );
  }
}