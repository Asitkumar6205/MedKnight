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
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string | null;
    role?: string;
    status?: string;
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
    error: "/auth/error", // Add a custom error page
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

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
          role: existingUser.role,
          status: existingUser.status,
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
          id: token.id, // <-- Add this line to pass the ID from token to session
        },
      };
    },
  },
};

// import type { NextAuthOptions } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "@/lib/db";
// import { compare } from "bcryptjs";
// import GoogleProvider from "next-auth/providers/google";
// import EmailProvider from "next-auth/providers/email";

// export const authOptions: NextAuthOptions = {
//   debug: true,
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.AUTH_SECRET!,
//   pages: {
//     signIn: "/signin",
//     verifyRequest: "/verify-request", // Custom page to display after a verification email is sent
//     newUser: "/signup", // Redirect new users here after email verification
//     error: "/auth/error",
//   },
//   providers: [
//     EmailProvider({
//       server: process.env.EMAIL_SERVER || {
//         host: process.env.EMAIL_SERVER_HOST,
//         port: Number(process.env.EMAIL_SERVER_PORT),
//         auth: {
//           user: process.env.EMAIL_SERVER_USER || "",
//           pass: process.env.EMAIL_SERVER_PASSWORD || "",
//         },
//       },
//       from: process.env.EMAIL_FROM || "noreply@example.com",
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           email: profile.email || null,
//           name: profile.name || profile.email?.split("@")[0] || "Anonymous",
//           username: profile.email?.split("@")[0] || "Anonymous",
//           image: profile.picture || null,
//         };
//       },
//       authorization: {
//         params: {
//           scope: "openid email profile",
//         },
//       }
//     }),
//     Credentials({
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//           placeholder: "jhondoe@example.com",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const user = await db.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) {
//           return null;
//         }

//         // Check if the user is approved
//         if (user.status !== "ACTIVE") {
//           throw new Error("Your account is pending approval by an administrator");
//         }

//         // Check if the user has a valid role
//         if (user.role === "PENDING") {
//           throw new Error("Your account role has not been assigned yet");
//         }

//         if (!user.password) {
//           return null;
//         }

//         const isPasswordValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isPasswordValid) {
//           return null;
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           username: user.username,
//           role: user.role,
//           status: user.status,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//      async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//         token.status = user.status;
//         token.username = user.username;
//         token.userId = user.id;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.role = token.role as string;
//         session.user.status = token.status as string;
//         session.user.username = token.username as string;
//         session.user.id = token.userId as string;
//       }
//       return session;
//     },
//   },
// };

// // Extend the built-in types
// declare module "next-auth" {
//   interface User {
//     username?: string | null;
//     role?: string;
//     status?: string;
//   }

//   interface Session {
//     user: {
//       id?: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//       username?: string | null;
//       role?: string;
//       status?: string;
//     }
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     username?: string | null;
//     role?: string;
//     status?: string;
//   }
// }

// export const authOptions: NextAuthOptions = {
//   debug: true,
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.AUTH_SECRET!,

//   pages: {
//     signIn: "/signin",
//     verifyRequest: "/verify-request", // Custom page to display after a verification email is sent
//     newUser: "/signup", // Redirect new users here after email verification
//     error: "/auth/error", // Custom error page
//   },
//   providers: [
//     EmailProvider({
//       server: process.env.EMAIL_SERVER || {
//         host: process.env.EMAIL_SERVER_HOST,
//         port: Number(process.env.EMAIL_SERVER_PORT),
//         auth: {
//           user: process.env.EMAIL_SERVER_USER || "",
//           pass: process.env.EMAIL_SERVER_PASSWORD || "",
//         },
//       },
//       from: process.env.EMAIL_FROM || "noreply@example.com",
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           email: profile.email || null,
//           name: profile.name || profile.email?.split("@")[0] || "Anonymous",
//           username: profile.email?.split("@")[0] || "Anonymous",
//           image: profile.picture || null,
//           // Set default role and status for Google sign-ins
//           role: "PENDING",
//           status: "PENDING_APPROVAL",
//         };
//       },
//       authorization: {
//         params: {
//           scope: "openid email profile",
//         },
//       }
//     }),
//     Credentials({
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//           placeholder: "jhondoe@example.com",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const email = String(credentials.email);
//         const password = String(credentials.password);

//         const existingUser = await db.user.findUnique({
//           where: { email: email },
//           select: {
//             id: true,
//             username: true,
//             email: true,
//             password: true,
//             role: true,
//             status: true,
//             emailVerified: true,
//           },
//         });

//         if (!existingUser) {
//           return null;
//         }

//         // Check if email is verified
//         if (!existingUser.emailVerified) {
//           throw new Error("EMAIL_NOT_VERIFIED");
//         }

//         // Check if account is approved
//         if (existingUser.status !== "ACTIVE") {
//           throw new Error("ACCOUNT_NOT_APPROVED");
//         }

//         if (existingUser.password) {
//           const passwordMatched = await compare(
//             password,
//             existingUser.password
//           );

//           if (!passwordMatched) {
//             return null;
//           }
//         }

//         return {
//           id: `${existingUser.id}`,
//           username: existingUser.username,
//           email: existingUser.email,
//           role: existingUser.role,
//           status: existingUser.status,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user, account }) {
//       // Initial sign in
//       if (user) {
//         token.role = user.role || "PENDING";
//         token.status = user.status || "PENDING_APPROVAL";
//         token.username = user.username;

//         // If this is an OAuth sign-in, check if the user needs approval
//         if (account && account.provider !== "credentials") {
//           // Get the latest user data from DB to check status
//           const dbUser = await db.user.findUnique({
//             where: { email: user.email as string},
//             select: { role: true, status: true },
//           });

//           if (dbUser) {
//             token.role = dbUser.role;
//             token.status = dbUser.status;
//           }
//         }
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       // Send properties to the client
//       if (session.user) {
//         session.user.role = token.role;
//         session.user.status = token.status;
//         session.user.username = token.username;
//       }
//       return session;
//     },
//     async signIn({ user, account }) {
//       // For OAuth providers, we need to check if the user is approved
//       if (account && account.provider !== "credentials") {
//         const dbUser = await db.user.findUnique({
//           where: { email: user.email as string},
//           select: { status: true },
//         });

//         // If user exists in DB and is not approved, deny sign in
//         if (dbUser && dbUser.status !== "ACTIVE") {
//           return false;
//         }
//       }
//       return true;
//     },
//   },
//   events: {
//     // For OAuth sign-ins, ensure new users are set to pending approval
//     async createUser({ user }) {
//       await db.user.update({
//         where: { id: user.id },
//         data: {
//           role: "PENDING",
//           status: "PENDING_APPROVAL",
//         },
//       });
//     },
//   },
// };
