// // app/api/admin/users/[userId]/route.ts
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth"
// import { db } from "@/lib/db";
// import * as z from "zod";
// import { createTransport } from "nodemailer";

// const updateUserSchema = z.object({
//   role: z.enum(["ADMIN", "RADIOLOGIST", "HOSPITAL", "PENDING"]).optional(),
//   status: z.enum(["ACTIVE", "SUSPENDED", "PENDING_APPROVAL"]).optional(),
// });

// async function sendStatusUpdateEmail(email: string, status: string, role: string) {
//   const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
//   const emailServer = process.env.EMAIL_SERVER || {
//     host: process.env.EMAIL_SERVER_HOST || '',
//     port: Number(process.env.EMAIL_SERVER_PORT || 587),
//     auth: {
//       user: process.env.EMAIL_SERVER_USER || '',
//       pass: process.env.EMAIL_SERVER_PASSWORD || '',
//     },
//   };
  
//   const from = process.env.EMAIL_FROM || 'noreply@example.com';
//   const transport = createTransport(emailServer);
  
//   const loginUrl = `${baseUrl}/signin`;
  
//   let subject = '';
//   let message = '';
  
//   if (status === 'ACTIVE') {
//     subject = 'Account Approved';
//     message = `Your account has been approved with the role: ${role}. You can now sign in to the system.`;
//   } else if (status === 'SUSPENDED') {
//     subject = 'Account Suspended';
//     message = 'Your account has been suspended. Please contact the administrator for more information.';
//   } else {
//     return; // Don't send email for other status changes
//   }
  
//   await transport.sendMail({
//     to: email,
//     from,
//     subject,
//     text: `${message}\n\n${loginUrl}`,
//     html: `
//       <body style="background: #f9f9f9;">
//         <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
//           <tr>
//             <td align="center" style="padding: 20px 0px 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
//               <strong>${subject}</strong>
//             </td>
//           </tr>
//           <tr>
//             <td style="padding: 10px 30px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
//               <p>${message}</p>
//             </td>
//           </tr>
//           ${status === 'ACTIVE' ? `
//           <tr>
//             <td align="center" style="padding: 20px 0;">
//               <table border="0" cellspacing="0" cellpadding="0">
//                 <tr>
//                   <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
//                     <a href="${loginUrl}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">
//                       Sign In
//                     </a>
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>
//           ` : ''}
//         </table>
//       </body>
//     `,
//   });
// }

// export async function PATCH(
//   req: Request,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     // Check if user is authenticated and is an admin
//     if (!session || session.user.role !== "ADMIN") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const userId = params.userId;
//     const body = await req.json();
    
//     // Validate the request body
//     const { role, status } = updateUserSchema.parse(body);

//     // If no updates provided
//     if (!role && !status) {
//       return NextResponse.json(
//         { error: "No updates provided" },
//         { status: 400 }
//       );
//     }

//     // Get the user before update
//     const user = await db.user.findUnique({
//       where: { id: userId },
//       select: { email: true, status: true, role: true },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Update the user
//     const updatedUser = await db.user.update({
//       where: { id: userId },
//       data: {
//         ...(role && { role }),
//         ...(status && { status }),
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         role: true,
//         status: true,
//       },
//     });

//     // Send email notification if status changed to ACTIVE or SUSPENDED
//     if (status && status !== user.status) {
//       try {
//         await sendStatusUpdateEmail(
//           user.email as string,
//           status,
//           role || user.role as string
//         );
//       } catch (emailError) {
//         console.error("Failed to send status update email:", emailError);
//         // Continue the flow even if email notification fails
//       }
//     }

//     return NextResponse.json({ user: updatedUser }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating user:", error);
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: "Invalid data", details: error.errors },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: "Failed to update user" },
//       { status: 500 }
//     );
//   }
// }