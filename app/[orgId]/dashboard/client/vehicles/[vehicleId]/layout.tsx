import type React from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { VehicleDetailLayout } from "@/components/vehicles/vehicle-detail-layout"

export default async function VehicleDetailLayoutPage({
  children,
  params,
}: {
  children: React.ReactNode
  params: { orgId: string; vehicleId: string }
}) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  // Check if user has access to this organization
  const orgMembership = user.organizationMemberships?.find((membership) => membership.organization.id === params.orgId)

  if (!orgMembership) {
    return redirect("/org-selection")
  }

  // Check if user has client role
  const isClient = orgMembership.role === "basic_member"
  if (!isClient) {
    return redirect(`/org/${params.orgId}/dashboard`)
  }

  return (
    <VehicleDetailLayout orgId={params.orgId} vehicleId={params.vehicleId}>
      {children}
    </VehicleDetailLayout>
  )
}
