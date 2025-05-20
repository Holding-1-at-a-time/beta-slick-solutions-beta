import type { ReactNode } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import ClientSidebar from "@/components/tenant/client-sidebar"

interface ClientLayoutProps {
  children: ReactNode
  params: {
    orgId: string
  }
}

export default async function ClientLayout({ children, params }: ClientLayoutProps) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  // Check if user has client role in this organization
  const org = user.organizationMemberships.find((membership) => membership.organization.id === params.orgId)

  if (!org || !org.role.includes("client")) {
    return redirect(`/org/${params.orgId}/dashboard`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex">
        <ClientSidebar orgId={params.orgId} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
