import TenantLandingLayout from "@/components/layouts/tenant-landing-layout"
import OrganizationList from "@/components/tenant/organization-list"

export default function OrganizationSelectionPage() {
  return (
    <TenantLandingLayout>
      <OrganizationList />
    </TenantLandingLayout>
  )
}
