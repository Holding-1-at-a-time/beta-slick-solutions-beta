import { NotificationsList } from "@/components/notifications"

export default function NotificationsPage({ params }: { params: { orgId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <NotificationsList orgId={params.orgId} />
    </div>
  )
}
