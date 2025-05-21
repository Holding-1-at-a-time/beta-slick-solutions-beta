import { ClientDashboard } from "@/components/dashboard/client-dashboard"

export default function ClientDashboardPage({ params }: { params: { orgId: string } }) {
  return <ClientDashboard orgId={params.orgId} />
}
