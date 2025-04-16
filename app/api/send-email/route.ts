// File: pages/api/send-email.ts (for Next.js)
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface FormData {
  fullName: string;
  email: string;
  organization: string;
  message: string;
}

interface EmailRequestBody {
  to: string;
  subject: string;
  formData: FormData;
}

type ApiResponse = {
  message: string;
  error?: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, formData } = body;

    // Configure your email transporter with the correct env variable names
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587', 10),
      secure: false, // Use true if you're on port 465 with SSL, false for other ports like 587
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Create email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.fullName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Organization:</strong> ${formData.organization}</p>
      <p><strong>Message:</strong> ${formData.message}</p>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: emailContent,
    });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Failed to send email', error: errorMessage }, { status: 500 });
  }
}