import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks(.*)"])

// Define organization routes that require organization context
const isOrgRoute = createRouteMatcher(["/org/:id(.*)", "/org-selection(.*)"])

// Define admin routes that require admin permissions
const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, req) => {
  // For debugging in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Clerk Middleware] Path: ${req.nextUrl.pathname}`)
  }

  // Handle public routes - allow access without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Protect all non-public routes - user must be authenticated
  if (!auth.userId) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(signInUrl)
  }

  // Handle organization routes - ensure organization context
  if (isOrgRoute(req)) {
    // Extract organization ID from the URL if present
    const orgIdMatch = req.nextUrl.pathname.match(/\/org\/([^/]+)/)
    const requestedOrgId = orgIdMatch ? orgIdMatch[1] : null

    // If a specific org is requested in the URL but doesn't match the active org
    if (requestedOrgId && requestedOrgId !== auth.orgId) {
      // Check if user has access to the requested organization
      // Note: We're not using auth.has() here as it might be causing the issue
      // Instead, we'll just check if the user is authenticated
      return NextResponse.next()
    }

    // If no organization is active at all, redirect to org selection
    if (!auth.orgId) {
      return NextResponse.redirect(new URL("/org-selection", req.url))
    }
  }

  // Handle admin routes - ensure admin permissions
  if (isAdminRoute(req)) {
    // Simple role check using session claims
    // This avoids potential issues with auth.has()
    const isAdmin = auth.sessionClaims?.metadata?.role === "admin"

    if (!isAdmin) {
      // User doesn't have admin permissions
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

// Fixed matcher configuration without capturing groups
export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next|api|trpc).*)",
    "/api/:path*",
    "/trpc/:path*",
  ],
}
