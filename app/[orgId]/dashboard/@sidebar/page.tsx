import { currentUser } from "@clerk/nextjs/server"
import Sidebar from "@/components/tenant/sidebar"

export default async function SidebarPage({ params }: { params: { orgId: string } }) {
  const user = await currentUser()

  if (!user) {
    return null
  }

  return <Sidebar orgId={params.orgId} />
}
