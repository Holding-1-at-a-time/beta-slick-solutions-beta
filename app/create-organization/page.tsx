import TenantLandingLayout from "@/components/layouts/tenant-landing-layout"
import CreateOrganization from "@/components/tenant/create-organization"

export default function CreateOrganizationPage() {
  return (
    <TenantLandingLayout>
      <CreateOrganization />
    </TenantLandingLayout>
  )
}
