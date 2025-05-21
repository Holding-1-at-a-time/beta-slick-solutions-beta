import { NotificationDetail } from "@/components/notifications"

export default function NotificationDetailPage({ params }: { params: { orgId: string; notificationId: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notification Details</h1>
      <NotificationDetail orgId={params.orgId} notificationId={params.notificationId} />
    </div>
  )
}
