import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function ClientDashboardPage({ params }: { params: { orgId: string } }) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <ClientDashboard orgId={params.orgId} />
    </ConvexClientProvider>
  )
}
