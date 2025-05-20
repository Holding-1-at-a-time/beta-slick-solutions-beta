import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks(.*)"])

// Define organization routes that require organization context
const isOrgRoute = createRouteMatcher(["/org/:id(.*)", "/org-selection(.*)"])

// Define admin routes that require admin permissions
const isAdminRoute = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(
  async (auth, req) => {
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
        try {
          // Check if user has access to the requested organization
          const hasAccess = auth.has({
            permission: "org:member",
            orgId: requestedOrgId,
          })

          if (!hasAccess) {
            // User doesn't have access to the requested organization
            return NextResponse.redirect(new URL("/org-selection", req.url))
          }
        } catch (error) {
          console.error("Error checking organization access:", error)
          return NextResponse.redirect(new URL("/org-selection", req.url))
        }
      }

      // If no organization is active at all, redirect to org selection
      if (!auth.orgId) {
        return NextResponse.redirect(new URL("/org-selection", req.url))
      }
    }

    // Handle admin routes - ensure admin permissions
    if (isAdminRoute(req)) {
      try {
        // Check if user has admin permissions
        const isAdmin = auth.has({ permission: "org:admin" })

        if (!isAdmin) {
          // User doesn't have admin permissions
          return NextResponse.redirect(new URL("/", req.url))
        }
      } catch (error) {
        console.error("Error checking admin permissions:", error)
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  { debug: process.env.NODE_ENV === "development" },
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(html?|css|js|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
