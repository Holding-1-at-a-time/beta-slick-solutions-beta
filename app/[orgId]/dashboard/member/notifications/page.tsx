import { NotificationsList } from "@/components/member"
import { Card } from "@/components/ui/card"

export default function NotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <Card className="p-6">
        <NotificationsList />
      </Card>
    </div>
  )
}
