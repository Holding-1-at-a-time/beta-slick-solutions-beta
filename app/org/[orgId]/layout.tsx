import type React from "react"
import TenantLayout from "@/components/layouts/tenant-layout"

export default function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { orgId: string }
}) {
  return <TenantLayout orgId={params.orgId}>{children}</TenantLayout>
}
