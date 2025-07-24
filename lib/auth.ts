import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import EmailProvider from "next-auth/providers/email";

declare module "next-auth" {
  interface User {
    username?: string | null;
    role?: string;
    status?: string;
    userType?: string | null;
    qualifications?: string[];
    subspeciality?: string | null;
    isOnline?: boolean;
    lastSeen?: Date | null;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      role?: string;
      status?: string;
      userType?: string | null;
      qualifications?: string[];
      subspeciality?: string | null;
      isOnline?: boolean;
      lastSeen?: Date | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string | null;
    role?: string;
    status?: string;
    userType?: string | null;
    qualifications?: string[];
    subspeciality?: string | null;
    isOnline?: boolean;
    lastSeen?: Date | null;
  }
}

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
    newUser: "/signup",
    error: "/auth/error",
  },
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER || {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "no-reply@medknight.in",
    }),
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jhondoe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        const existingUser = await db.user.findUnique({
          where: { email: email },
        });

        console.log("User from database:", {
          id: existingUser?.id,
          email: existingUser?.email,
          userType: existingUser?.userType,
          qualifications: existingUser?.qualifications,
          subspeciality: existingUser?.subspeciality,
        });

        if (!existingUser) {
          return null;
        }

        // Check if the user is approved
        if (existingUser.status !== "ACTIVE") {
          throw new Error(
            existingUser.status === "PENDING_APPROVAL"
              ? "pending_approval"
              : "account_suspended"
          );
        }

        if (existingUser.password) {
          const passwordMatched = await compare(
            password,
            existingUser.password
          );

          if (!passwordMatched) {
            return null;
          }
        }

        // Return user object with correct types
        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          status: existingUser.status,
          userType: existingUser.userType,
          qualifications: existingUser.qualifications || [],
          subspeciality: existingUser.subspeciality,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          username: user.username,
          role: user.role,
          status: user.status,
          userType: user.userType,
          qualifications: user.qualifications || [],
          subspeciality: user.subspeciality,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          role: token.role,
          status: token.status,
          userType: token.userType,
          qualifications: token.qualifications || [],
          subspeciality: token.subspeciality,
          isOnline: token.isOnline,
          lastSeen: token.lastSeen,
          id: token.id,
        },
      };
    },
  },
};