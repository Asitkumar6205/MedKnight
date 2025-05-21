// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });

  // Handle API routes protection
  if (pathname.startsWith("/api/")) {
    // Public API routes that don't require authentication
    const publicApiRoutes = [
      "/api/auth", // NextAuth routes
      "/api/verify-email", // Email verification endpoint
      "/api/user", // User registration endpoint
      "/api/send-email",
      "/api/me",
    ];

    // Check if the route is public
    if (publicApiRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Require authentication for all other API routes
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized: Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Rest of the middleware remains the same...
    // Check if user account is active
    if (token.status !== "ACTIVE") {
      return new NextResponse(
        JSON.stringify({ 
          error: "Unauthorized", 
          reason: token.status === "PENDING_APPROVAL" ? "Account pending approval" : "Account suspended" 
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Define role-based API access permissions
    const roleApiPermissions = {
      ADMIN: [
        "/api/me",
        "/api/user",
        "/api/getCases",
        "/api/cases", // Added: This allows access to /api/cases/[id]/lock
        "/api/saveReport",
        "/api/admin/users",
        "/api/studies",
        "/api/deleteCase",
        "/api/deleteAllStudies",
        "/api/getCompletedCases",
        "/api/caseReview",
        "/api/postCase",
        "/api/hospital/getuser",
        "/api/hospital/postuser",
        "/api/hospital/deleteuser",
        "/api/radiologist/getuser",
        "/api/radiologist/postuser",
        "/api/radiologist/deleteuser",
        "/api/updateActiveCase",
        "/api/updateCompletedCase"
      ],
      RADIOLOGIST: [
        "/api/me",
        "/api/user",
        "/api/getCases",
        "/api/cases", // Added: This allows access to /api/cases/[id]/lock
        "/api/radiologist/getuser",
        "/api/saveReport",
        "/api/getCompletedCases",
        "/api/caseReview",
        "/api/updateActiveCase",
        "/api/updateCompletedCase"
      ],
      HOSPITAL: [
        "/api/me",
        "/api/user",
        "/api/getCases",
        "/api/studies",
        "/api/hospital/getuser",
        "/api/postCase",
        "/api/hospital/postuser",
        "/api/hospital/deleteuser",
        "/api/getCompletedCases",
        "/api/caseReview"
      ]
    };

    // Admin-specific routes - only ADMIN role can access
    if (pathname.startsWith("/api/admin/")) {
      if (token.role !== "ADMIN") {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden: Admin access required" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Hospital-specific routes - only ADMIN or HOSPITAL roles can access
    if (pathname.startsWith("/api/hospital/")) {
      if (token.role !== "ADMIN" && token.role !== "HOSPITAL") {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden: Hospital access required" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Radiologist-specific routes - only ADMIN or RADIOLOGIST roles can access
    if (pathname.startsWith("/api/radiologist/")) {
      if (token.role !== "ADMIN" && token.role !== "RADIOLOGIST") {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden: Radiologist access required" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Check if user has permission to access the endpoint based on their role
    const userRole = token.role as keyof typeof roleApiPermissions;
    
    // If role is not defined in our permissions map, deny access
    if (!roleApiPermissions[userRole]) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden: Invalid role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the exact path is allowed for the user's role
    // or if any of the parent paths are allowed
    const hasPermission = roleApiPermissions[userRole].some(
      allowedPath => pathname === allowedPath || pathname.startsWith(`${allowedPath}/`)
    );

    if (!hasPermission) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden: Insufficient permissions for this endpoint" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Original frontend route protection
  if (pathname.startsWith("/admin") && !token) {
    // Redirect to access-denied page instead of signin
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  // Check if user is active for any protected route
  if (pathname.startsWith("/admin") && token && token.status !== "ACTIVE") {
    if (token.status === "PENDING_APPROVAL") {
      return NextResponse.redirect(
        new URL("/auth/error?error=pending_approval", request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL("/auth/error?error=account_suspended", request.url)
      );
    }
  }

  // Role-based access control for admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    // RADIOLOGIST specific routes
    if (token?.role === "RADIOLOGIST") {
      const allowedPaths = [
        "/admin/completed-orders",
        "/admin/settings",
        "/admin/active-studies",
        "/admin/radiologists",
        "/admin/report",
        "/admin/report/write",
      ];

      // Check if current path is allowed for RADIOLOGIST
      if (!allowedPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // HOSPITAL specific routes
    else if (token?.role === "HOSPITAL") {
      const allowedPaths = [
        "/admin/active-orders",
        "/admin/completed-orders",
        "/admin/create-order",
        "/admin/hospital-users",
        "/admin/payments",
        "/admin/settings",
      ];

      // Check if current path is allowed for HOSPITAL
      if (!allowedPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // For any other role (not ADMIN, RADIOLOGIST, or HOSPITAL)
    else if (token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Protected frontend routes
    '/admin/:path*',
    // All API routes
    '/api/:path*'
  ],
};  