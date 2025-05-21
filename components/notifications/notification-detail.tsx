"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { formatDate } from "@/lib/utils/format-date"
import Link from "next/link"
import { useEffect } from "react"

export function NotificationDetail({ orgId, notificationId }: { orgId: string; notificationId: string }) {
  const { userId } = useAuth()
  const { data: notification, isLoading } = useQuery(
    api.notifications.getNotification,
    orgId,
    userId as string,
    notificationId,
  )

  const markRead = useMutation(api.notifications.markNotificationRead)

  // Mark as read when viewed
  useEffect(() => {
    if (notification && !notification.isRead) {
      markRead(orgId, userId as string, notificationId)
    }
  }, [notification, markRead, orgId, userId, notificationId])

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (!notification) {
    return <div className="text-center py-8">Notification not found</div>
  }

  // Generate related content link based on notification type
  const getRelatedLink = () => {
    if (!notification.relatedId) return null

    switch (notification.type) {
      case "invoice":
        return `/org/${orgId}/dashboard/client/invoices/${notification.relatedId}`
      case "appointment":
        return `/org/${orgId}/dashboard/client/appointments/${notification.relatedId}`
      case "assessment":
        return `/org/${orgId}/dashboard/client/assessments/${notification.relatedId}`
      default:
        return null
    }
  }

  const relatedLink = getRelatedLink()

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{notification.title}</h2>
        <p className="text-gray-600">Received on {formatDate(notification.createdAt)}</p>
      </div>

      <div className="prose max-w-none mb-6">
        <p>{notification.message}</p>
      </div>

      {relatedLink && (
        <div className="mb-6">
          <Link href={relatedLink} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block">
            View {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </Link>
        </div>
      )}

      <div className="flex justify-end">
        <Link href={`/org/${orgId}/dashboard/client/notifications`} className="text-blue-600 hover:text-blue-800">
          Back to Notifications
        </Link>
      </div>
    </div>
  )
}
