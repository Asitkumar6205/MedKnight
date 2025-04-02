import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET!,
  
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request", // Custom page to display after a verification email is sent
    newUser: "/signup", // Redirect new users here after email verification
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
      from: process.env.EMAIL_FROM || "noreply@example.com",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email || null,
          name: profile.name || profile.email?.split("@")[0] || "Anonymous",
          username: profile.email?.split("@")[0] || "Anonymous",  
          image: profile.picture || null,
        };
      },
      authorization: {
        params: {
          scope: "openid email profile",
        },
      }
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

        if (!existingUser) {
          return null;
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

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
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
        },
      };
    },
  },
};

// async redirect({ url, baseUrl }) {
//   return baseUrl + "/signin"; // Ensures redirection always goes to /signin
// },