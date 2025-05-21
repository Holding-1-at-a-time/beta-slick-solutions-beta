"use client"

import { useMemberNotifications, useMarkNotificationRead } from "@/hooks/useMember"
import { formatDate } from "@/lib/utils/format-date"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Bell } from "lucide-react"

export default function NotificationsList() {
  const { notifications, isLoading } = useMemberNotifications()
  const markRead = useMarkNotificationRead()

  const handleMarkRead = async (notificationId: any) => {
    await markRead(notificationId)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
        <p className="mt-1 text-sm text-gray-500">You don't have any notifications at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card
          key={notification._id}
          className={`p-4 ${notification.isRead ? "bg-white" : "bg-blue-50"}`}
          onClick={() => !notification.isRead && handleMarkRead(notification._id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{notification.title}</h3>
                {!notification.isRead && <Badge className="bg-blue-500">New</Badge>}
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-2">{formatDate(notification.createdAt)}</p>
            </div>

            {notification.relatedId && (
              <Link
                href={`../assessments/review/${notification.relatedId}`}
                className="text-sm text-blue-600 hover:underline"
              >
                View
              </Link>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
