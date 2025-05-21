import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { NotificationDetail } from "@/components/notifications/notification-detail"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

export default async function NotificationDetailPage({
  params,
}: {
  params: { orgId: string; notificationId: string }
}) {
  const user = await currentUser()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <ConvexClientProvider>
      <NotificationDetail orgId={params.orgId} userId={user.id} notificationId={params.notificationId} />
    </ConvexClientProvider>
  )
}
