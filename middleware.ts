import { authMiddleware, clerkClient, redirectToSignIn } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export default authMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks(.*)"],
  async afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    // Handle org-scoped routes
    if (auth.userId && req.nextUrl.pathname.startsWith("/org") && !auth.orgId) {
      const orgSelection = new URL("/org-selection", req.url)
      return NextResponse.redirect(orgSelection)
    }

    // If the user is logged in and trying to access a protected route
    if (auth.userId && !auth.isPublicRoute) {
      // Fetch user to check their role
      const user = await clerkClient.users.getUser(auth.userId)

      // Example: Restrict admin routes to users with admin role
      if (req.nextUrl.pathname.startsWith("/admin") && !user.publicMetadata.role?.includes("admin")) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
