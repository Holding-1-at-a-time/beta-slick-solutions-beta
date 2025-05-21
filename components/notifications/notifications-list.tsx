"use client"

import { useNotifications } from "@/hooks/useNotifications"
import { formatDistanceToNow } from "@/lib/utils/format-date"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "@/components/ui/use-toast"
import { Bell, Check, Trash2 } from "lucide-react"
import Link from "next/link"

interface NotificationsListProps {
  orgId: string
  userId: string
}

export function NotificationsList({ orgId, userId }: NotificationsListProps) {
  const { notifications, loading, markNotificationAsRead, removeNotification } = useNotifications(orgId, userId)

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      toast({
        title: "Notification marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await removeNotification(notificationId)
      toast({
        title: "Notification deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment_reminder":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "invoice_due":
        return <Bell className="h-5 w-5 text-yellow-500" />
      case "invoice_overdue":
        return <Bell className="h-5 w-5 text-red-500" />
      case "assessment_complete":
        return <Bell className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationLink = (notification: any) => {
    if (!notification.entityId || !notification.entityType) {
      return null
    }

    switch (notification.entityType) {
      case "invoices":
        return {
          href: `/[orgId]/dashboard/client/invoices/${notification.entityId}`,
          as: `/${orgId}/dashboard/client/invoices/${notification.entityId}`,
        }
      case "appointments":
        return {
          href: `/[orgId]/dashboard/client/appointments/${notification.entityId}`,
          as: `/${orgId}/dashboard/client/appointments/${notification.entityId}`,
        }
      case "assessments":
        return {
          href: `/[orgId]/dashboard/client/vehicles/${notification.vehicleId}/assessments/${notification.entityId}`,
          as: `/${orgId}/dashboard/client/vehicles/${notification.vehicleId}/assessments/${notification.entityId}`,
        }
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
        <p className="text-gray-500 mt-1">You're all caught up! Check back later for updates.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Recent Notifications</h2>
        <Button
          variant="outline"
          onClick={() => {
            const unreadNotifications = notifications.filter((n) => !n.read)
            if (unreadNotifications.length === 0) {
              toast({
                title: "No unread notifications",
              })
              return
            }

            Promise.all(unreadNotifications.map((n) => markNotificationAsRead(n._id)))
              .then(() => {
                toast({
                  title: "All notifications marked as read",
                })
              })
              .catch(() => {
                toast({
                  title: "Error",
                  description: "Failed to mark all notifications as read",
                  variant: "destructive",
                })
              })
          }}
        >
          Mark all as read
        </Button>
      </div>

      <div className="border rounded-lg divide-y">
        {notifications.map((notification) => {
          const link = getNotificationLink(notification)
          const NotificationContent = (
            <div key={notification._id} className={`p-4 ${!notification.read ? "bg-blue-50" : ""}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-sm text-gray-500">{formatDistanceToNow(notification.createdAt)} ago</span>
                  </div>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  {!notification.read && (
                    <Badge variant="outline" className="mt-2 bg-blue-100">
                      New
                    </Badge>
                  )}
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleMarkAsRead(notification._id)
                      }}
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDelete(notification._id)
                    }}
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )

          return link ? (
            <Link key={notification._id} href={link.href} as={link.as}>
              {NotificationContent}
            </Link>
          ) : (
            <div key={notification._id}>{NotificationContent}</div>
          )
        })}
      </div>
    </div>
  )
}
