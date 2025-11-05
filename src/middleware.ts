import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Apply CSRF protection to API routes that modify data
    if (
      pathname.startsWith("/api/") &&
      ["POST", "PUT", "DELETE", "PATCH"].includes(req.method)
    ) {
      // Check Origin header matches Host header (built-in Next.js CSRF protection)
      const origin = req.headers.get("origin");
      const host = req.headers.get("host");

      if (origin && host) {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json(
            { error: "CSRF validation failed" },
            { status: 403 }
          );
        }
      }
    }

    // Admin routes - require admin role
    if (pathname.startsWith("/admin") || pathname.startsWith("/dev")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/dashboard?error=unauthorized", req.url)
        );
      }
    }

    // Protected routes - require authentication
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
      if (!token) {
        // Note: Cannot use logger in middleware due to Edge Runtime constraints
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith("/auth/") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/auth/") ||
          pathname.startsWith("/dev/") ||
          pathname === "/" ||
          pathname.startsWith("/blog") ||
          pathname.startsWith("/privacy-policy") ||
          pathname.startsWith("/contact-us") ||
          pathname.startsWith("/terms-of-service") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon")
        ) {
          return true;
        }

        // For all other routes, check if user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
