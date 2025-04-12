// app/api/verify-email/route.ts
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
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      // If user exists but not verified, mark as verified
      if (!existingUser.emailVerified) {
        await db.user.update({
          where: { email },
          data: { 
            emailVerified: new Date(),
            // Ensure the user remains in PENDING_APPROVAL status
            status: 'PENDING_APPROVAL',
            role: 'PENDING'
          },
        });
      }
    } else {
      // Create the user with verified email but pending approval status
      await db.user.create({
        data: {
          username: userData.username,
          email: email,
          password: userData.password, // Already hashed from previous step
          emailVerified: new Date(),
          status: 'PENDING_APPROVAL', // Set the initial status as pending approval
          role: 'PENDING' // Set role as pending
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
    
    // Redirect to a pending approval page
    return NextResponse.redirect(new URL('/pending-approval', req.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL('/error?message=Verification failed', req.url));
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const token = searchParams.get('token');
//     const email = searchParams.get('email');
//     const encodedData = searchParams.get('data');
    
//     if (!token || !email || !encodedData) {
//       return NextResponse.redirect(new URL('/error?message=Invalid verification link', req.url));
//     }
    
//     // Find the verification token
//     const verificationToken = await db.verificationToken.findFirst({
//       where: {
//         token,
//         identifier: email,
//         expires: {
//           gt: new Date(),
//         },
//       },
//     });
    
//     if (!verificationToken) {
//       return NextResponse.redirect(new URL('/error?message=Invalid or expired verification link', req.url));
//     }
    
//     // Decode user data
//     const userData = JSON.parse(Buffer.from(encodedData, 'base64').toString());
    
//     // Check if user already exists (might have been created in a race condition)
//     const existingUser = await db.user.findUnique({
//       where: { email },
//     });
    
//     if (existingUser) {
//       // If user exists but not verified, mark as verified
//       if (!existingUser.emailVerified) {
//         await db.user.update({
//           where: { email },
//           data: { emailVerified: new Date() },
//         });
//       }
//     } else {
//       // Create the user with verified email but pending approval status
//       await db.user.create({
//         data: {
//           username: userData.username,
//           email: email,
//           password: userData.password, // Already hashed from previous step
//           emailVerified: new Date(),
//           role: userData.requestedRole || "PENDING", // Default role is PENDING
//           status: "PENDING_APPROVAL" // All new users require approval
//         },
//       });

//       // Notify admins of new user registration
//       try {
//         // Import must be inside try block since it's a dynamic import
//         const { createTransport } = await import("nodemailer");
        
//         const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@example.com'];
//         const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        
//         const emailServer = process.env.EMAIL_SERVER || {
//           host: process.env.EMAIL_SERVER_HOST || '',
//           port: Number(process.env.EMAIL_SERVER_PORT || 587),
//           auth: {
//             user: process.env.EMAIL_SERVER_USER || '',
//             pass: process.env.EMAIL_SERVER_PASSWORD || '',
//           },
//         };
        
//         const from = process.env.EMAIL_FROM || 'noreply@example.com';
//         const transport = createTransport(emailServer);
        
//         const approvalUrl = `${baseUrl}/admin/users`;
        
//         await transport.sendMail({
//           to: adminEmails,
//           from,
//           subject: `New User Registration: Approval Required`,
//           text: `A new user (${email}) has signed up and requires approval. Please review at ${approvalUrl}`,
//           html: `
//             <body style="background: #f9f9f9;">
//               <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
//                 <tr>
//                   <td align="center" style="padding: 20px 0px 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
//                     <strong>New User Approval Required</strong>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 30px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
//                     <p>A new user has registered and requires your approval:</p>
//                     <p><strong>Email:</strong> ${email}</p>
//                     <p><strong>Requested Role:</strong> ${userData.requestedRole || "Not specified"}</p>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td align="center" style="padding: 20px 0;">
//                     <table border="0" cellspacing="0" cellpadding="0">
//                       <tr>
//                         <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
//                           <a href="${approvalUrl}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">
//                             Review User
//                           </a>
//                         </td>
//                       </tr>
//                     </table>
//                   </td>
//                 </tr>
//               </table>
//             </body>
//           `,
//         });
//       } catch (emailError) {
//         console.error("Failed to send admin notification:", emailError);
//         // Continue the flow even if admin notification fails
//       }
//     }
    
//     // Delete the verification token
//     await db.verificationToken.delete({
//       where: { 
//         identifier_token: {
//           identifier: verificationToken.identifier,
//           token: verificationToken.token,
//         }
//       },
//     });
    
//     // Redirect to login page with success and pending approval message
//     return NextResponse.redirect(new URL('/signin?verified=true&pendingApproval=true', req.url));
//   } catch (error) {
//     console.error("Verification error:", error);
//     return NextResponse.redirect(new URL('/error?message=Verification failed', req.url));
//   }
// }









// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const token = searchParams.get('token');
//     const email = searchParams.get('email');
//     const encodedData = searchParams.get('data');
    
//     if (!token || !email || !encodedData) {
//       return NextResponse.redirect(new URL('/error?message=Invalid verification link', req.url));
//     }
    
//     // Find the verification token
//     const verificationToken = await db.verificationToken.findFirst({
//       where: {
//         token,
//         identifier: email,
//         expires: {
//           gt: new Date(),
//         },
//       },
//     });
    
//     if (!verificationToken) {
//       return NextResponse.redirect(new URL('/error?message=Invalid or expired verification link', req.url));
//     }
    
//     // Decode user data
//     const userData = JSON.parse(Buffer.from(encodedData, 'base64').toString());
    
//     // Check if user already exists (might have been created in a race condition)
//     const existingUser = await db.user.findUnique({
//       where: { email },
//     });
    
//     if (existingUser) {
//       // If user exists but not verified, mark as verified
//       if (!existingUser.emailVerified) {
//         await db.user.update({
//           where: { email },
//           data: { emailVerified: new Date() },
//         });
//       }
//     } else {
//       // Create the user with verified email but pending approval status
//       await db.user.create({
//         data: {
//           username: userData.username,
//           email: email,
//           password: userData.password, // Already hashed from previous step
//           emailVerified: new Date(),
//           role: userData.requestedRole || "PENDING", // Default role is PENDING
//           status: "PENDING_APPROVAL" // All new users require approval
//         },
//       });

//       // Notify admins of new user registration
//       try {
//         // Import must be inside try block since it's a dynamic import
//         const { createTransport } = await import("nodemailer");
        
//         const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : ['admin@example.com'];
//         const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        
//         const emailServer = process.env.EMAIL_SERVER || {
//           host: process.env.EMAIL_SERVER_HOST || '',
//           port: Number(process.env.EMAIL_SERVER_PORT || 587),
//           auth: {
//             user: process.env.EMAIL_SERVER_USER || '',
//             pass: process.env.EMAIL_SERVER_PASSWORD || '',
//           },
//         };
        
//         const from = process.env.EMAIL_FROM || 'noreply@example.com';
//         const transport = createTransport(emailServer);
        
//         const approvalUrl = `${baseUrl}/admin/users`;
        
//         await transport.sendMail({
//           to: adminEmails,
//           from,
//           subject: `New User Registration: Approval Required`,
//           text: `A new user (${email}) has signed up and requires approval. Please review at ${approvalUrl}`,
//           html: `
//             <body style="background: #f9f9f9;">
//               <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: #ffffff; max-width: 600px; margin: auto; border-radius: 10px;">
//                 <tr>
//                   <td align="center" style="padding: 20px 0px 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
//                     <strong>New User Approval Required</strong>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 10px 30px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #444444;">
//                     <p>A new user has registered and requires your approval:</p>
//                     <p><strong>Email:</strong> ${email}</p>
//                     <p><strong>Requested Role:</strong> ${userData.requestedRole || "Not specified"}</p>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td align="center" style="padding: 20px 0;">
//                     <table border="0" cellspacing="0" cellpadding="0">
//                       <tr>
//                         <td align="center" style="border-radius: 5px;" bgcolor="#346df1">
//                           <a href="${approvalUrl}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid #346df1; display: inline-block; font-weight: bold;">
//                             Review User
//                           </a>
//                         </td>
//                       </tr>
//                     </table>
//                   </td>
//                 </tr>
//               </table>
//             </body>
//           `,
//         });
//       } catch (emailError) {
//         console.error("Failed to send admin notification:", emailError);
//         // Continue the flow even if admin notification fails
//       }
//     }
    
//     // Delete the verification token
//     await db.verificationToken.delete({
//       where: { 
//         identifier_token: {
//           identifier: verificationToken.identifier,
//           token: verificationToken.token,
//         }
//       },
//     });
    
//     // Redirect to login page with success and pending approval message
//     return NextResponse.redirect(new URL('/signin?verified=true&pendingApproval=true', req.url));
//   } catch (error) {
//     console.error("Verification error:", error);
//     return NextResponse.redirect(new URL('/error?message=Verification failed', req.url));
//   }
// }