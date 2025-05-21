"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils/format-date"
import Link from "next/link"

export function NotificationsList({ orgId }: { orgId: string }) {
  const { userId } = useAuth()
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  const { data, isLoading } = useQuery(
    api.notifications.getNotifications,
    orgId,
    userId as string,
    { limit: 20 },
    showUnreadOnly,
  )

  const notifications = data?.notifications || []
  const markRead = useMutation(api.notifications.markNotificationRead)
  const markAllRead = useMutation(api.notifications.markAllNotificationsRead)

  const handleMarkRead = async (notificationId: string) => {
    await markRead(orgId, userId as string, notificationId)
  }

  const handleMarkAllRead = async () => {
    await markAllRead(orgId, userId as string)
  }

  const handleFilterChange = () => {
    setShowUnreadOnly(!showUnreadOnly)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="unread-filter"
            checked={showUnreadOnly}
            onChange={handleFilterChange}
            className="rounded"
          />
          <label htmlFor="unread-filter" className="text-sm">
            Show unread only
          </label>
        </div>

        <button onClick={handleMarkAllRead} className="text-blue-600 hover:text-blue-800 text-sm">
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {showUnreadOnly ? "You don't have any unread notifications" : "You don't have any notifications"}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li key={notification._id} className={`py-4 ${!notification.isRead ? "bg-blue-50" : ""}`}>
              <div className="flex justify-between">
                <div>
                  <Link
                    href={`/org/${orgId}/dashboard/client/notifications/${notification._id}`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600"
                  >
                    {notification.title}
                  </Link>
                  <p className="mt-1 text-gray-600">{notification.message}</p>
                  <p className="mt-1 text-sm text-gray-500">{formatDate(notification.createdAt)}</p>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification._id)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
