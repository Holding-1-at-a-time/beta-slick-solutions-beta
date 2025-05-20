import type { ReactNode } from "react"
import { notFound, redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs"
import TenantHeader from "@/components/tenant/tenant-header"
import DashboardLayout from "@/components/layouts/dashboard-layout"

interface TenantLayoutProps {
  children: ReactNode
  params: {
    orgId: string
  }
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { orgId } = params

  // Get current user
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Verify the user has access to this organization
  try {
    const membership = await clerkClient.users.getOrganizationMembership({
      userId: user.id,
      organizationId: orgId,
    })

    if (!membership) {
      return notFound()
    }

    // Get organization details
    const organization = await clerkClient.organizations.getOrganization({ organizationId: orgId })

    if (!organization) {
      return notFound()
    }

    return (
      <div className="flex min-h-screen flex-col">
        <TenantHeader organization={organization} />
        <DashboardLayout>{children}</DashboardLayout>
      </div>
    )
  } catch (error) {
    console.error("Error fetching organization data:", error)
    return notFound()
  }
}
