import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ClientSettings } from "@/components/client/client-settings"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function SettingsPage({ params }: { params: { orgId: string } }) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <ClientSettings orgId={params.orgId} />
    </ConvexClientProvider>
  )
}
