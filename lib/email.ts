// lib/email.ts - Let's make sure the sendPasswordResetEmail function is properly implemented
import { createTransport } from "nodemailer";
import type { TransportOptions } from "nodemailer";

// Define a more flexible interface that can work with both NextAuth's types and our own usage
interface VerificationRequestParams {
  identifier: string;
  url: string;
  provider: {
    server:
      | string
      | TransportOptions
      | {
          host: string;
          port: number;
          auth: {
            user: string;
            pass: string;
          };
        };
    from: string;
  };
}

interface EmailTemplate {
  url: string;
  host: string;
  email?: string;
}

export async function sendVerificationRequest({
  identifier,
  url,
  provider,
}: VerificationRequestParams) {
  const { host } = new URL(url);
  const transport = createTransport(provider.server);

  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host, email: identifier }),
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }

  return result;
}

// Add the password reset email function
export async function sendPasswordResetEmail({
  to,
  resetUrl,
  from,
}: {
  to: string;
  resetUrl: string;
  from: string;
}) {
  try {
    // Get the host from the resetUrl
    const { host } = new URL(resetUrl);

    // Create email transport
    const transport = createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      secure: process.env.NODE_ENV === "production",
    });

    // Send the email
    const result = await transport.sendMail({
      to,
      from,
      subject: `Reset your password for ${host}`,
      text: passwordResetText({ url: resetUrl, host }),
      html: passwordResetHtml({ url: resetUrl, host, email: to }),
    });

    // Check for failed recipients
    const failed = result.rejected.concat(result.pending).filter(Boolean);
    if (failed.length) {
      throw new Error(
        `Password reset email could not be sent to ${failed.join(", ")}`
      );
    }

    return result;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

// Email text version
function text({ url, host }: EmailTemplate): string {
  return `Sign in to ${host}\n${url}\n\n`;
}

// Email HTML version
function html({ url, host, email }: EmailTemplate): string {
  // You can customize this HTML template
  const escapedEmail = `${email?.replace(/\./g, "&#8203;.")}`;
  const backgroundColor = "#f9f9f9";
  const textColor = "#444444";
  const mainBackgroundColor = "#ffffff";
  const buttonBackgroundColor = "rgb(147, 51, 234)";
  const buttonBorderColor = "#346df1";
  const buttonTextColor = "#ffffff";

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${host}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px;">
        <!-- MedKnight Logo -->
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <img src="LOGO-MEDKNIGHT.png" height="60" width="60" alt="MedKnight logo" style="display: inline-block; vertical-align: middle;">
              <span style="display: inline-block; vertical-align: middle; font-size: 24px; font-weight: bold; font-family: Helvetica, Arial, sans-serif;">
                <span style="background: linear-gradient(to right, #f8fafc, #9ca3af); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Med</span><span style="background: linear-gradient(to right, #a855f7, #57534e); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Knight</span>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}">
              <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">
                Sign in
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
  `;
}

// Password reset text version
function passwordResetText({ url, host }: EmailTemplate): string {
  return `Reset your password for ${host}\n\nPlease click the link below to reset your password:\n${url}\n\nIf you did not request this email, you can safely ignore it. Your password will remain unchanged.\n\nThis link is valid for 1 hour.\n`;
}

// Password reset HTML version
function passwordResetHtml({ url, host, email }: EmailTemplate): string {
  const escapedEmail = `${email?.replace(/\./g, "&#8203;.")}`;
  const backgroundColor = "#f9f9f9";
  const textColor = "#444444";
  const mainBackgroundColor = "#ffffff";
  const buttonBackgroundColor = "#3b82f6"; // Blue color for password reset
  const buttonBorderColor = "#2563eb";
  const buttonTextColor = "#ffffff";

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${host}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px;">
        <!-- MedKnight Logo -->
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <img src="LOGO-MEDKNIGHT.png" height="60" width="60" alt="MedKnight logo" style="display: inline-block; vertical-align: middle;">
              <span style="display: inline-block; vertical-align: middle; font-size: 24px; font-weight: bold; font-family: Helvetica, Arial, sans-serif;">
                <span style="background: linear-gradient(to right, #f8fafc, #9ca3af); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Med</span><span style="background: linear-gradient(to right, #a855f7, #57534e); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Knight</span>
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Password Reset Request for <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}">
              <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this password reset, you can safely ignore this email.<br>Your password will remain unchanged.
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        This link is valid for 1 hour.
      </td>
    </tr>
  </table>
</body>
  `;
}