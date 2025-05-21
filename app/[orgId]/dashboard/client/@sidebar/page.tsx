import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ClientSidebar } from "@/components/tenant/client-sidebar"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function ClientSidebarPage({ params }: { params: { orgId: string } }) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <ClientSidebar orgId={params.orgId} userId={user.id} />
    </ConvexClientProvider>
  )
}
