import { ClientSidebar } from "@/components/tenant/client-sidebar"

export default function ClientSidebarPage({ params }: { params: { orgId: string } }) {
  return <ClientSidebar orgId={params.orgId} />
}
