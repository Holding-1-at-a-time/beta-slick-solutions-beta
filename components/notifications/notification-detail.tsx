"use client"

import { useNotification } from "@/hooks/useNotification"
import { formatDate } from "@/lib/utils/format-date"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "@/components/ui/use-toast"
import { Bell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AIInsightsCard } from "./ai-insights-card"

interface NotificationDetailProps {
  orgId: string
  userId: string
  notificationId: string
}

export function NotificationDetail({ orgId, userId, notificationId }: NotificationDetailProps) {
  const { notification, loading, markNotificationAsRead } = useNotification(orgId, userId, notificationId)
  const router = useRouter()

  const handleMarkAsRead = async () => {
    try {
      await markNotificationAsRead()
      toast({
        title: "Notification marked as read",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const getRelatedEntityLink = () => {
    if (!notification?.entityId || !notification?.entityType) {
      return null
    }

    switch (notification.entityType) {
      case "invoices":
        return {
          href: `/[orgId]/dashboard/client/invoices/${notification.entityId}`,
          as: `/${orgId}/dashboard/client/invoices/${notification.entityId}`,
          label: "View Invoice",
        }
      case "appointments":
        return {
          href: `/[orgId]/dashboard/client/appointments/${notification.entityId}`,
          as: `/${orgId}/dashboard/client/appointments/${notification.entityId}`,
          label: "View Appointment",
        }
      case "assessments":
        return {
          href: `/[orgId]/dashboard/client/vehicles/${notification.vehicleId}/assessments/${notification.entityId}`,
          as: `/${orgId}/dashboard/client/vehicles/${notification.vehicleId}/assessments/${notification.entityId}`,
          label: "View Assessment",
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

  if (!notification) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Notification not found</p>
      </div>
    )
  }

  const relatedEntityLink = getRelatedEntityLink()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notification Details</h1>
        <Link
          href={`/[orgId]/dashboard/client/notifications`}
          as={`/${orgId}/dashboard/client/notifications`}
          className="text-blue-600 hover:underline"
        >
          Back to Notifications
        </Link>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <Bell className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold">{notification.title}</h2>
            <p className="text-gray-500 mt-1">Received on {formatDate(notification.createdAt)}</p>
            <div className="mt-4 text-gray-700">{notification.message}</div>

            {notification.read ? (
              <div className="mt-4 text-sm text-gray-500">
                Read on {formatDate(notification.readAt || notification.createdAt)}
              </div>
            ) : (
              <div className="mt-4">
                <Button onClick={handleMarkAsRead}>Mark as Read</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {notification.relatedEntity && (
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Related Information</h2>
          <div className="space-y-2">
            {Object.entries(notification.relatedEntity)
              .filter(([key]) => !["_id", "_creationTime"].includes(key))
              .map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4">
                  <div className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                  <div className="col-span-2">{String(value)}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {relatedEntityLink && (
        <div className="flex justify-center">
          <Link href={relatedEntityLink.href} as={relatedEntityLink.as}>
            <Button>{relatedEntityLink.label}</Button>
          </Link>
        </div>
      )}

      {/* Add AI Insights Card */}
      <AIInsightsCard orgId={orgId} userId={userId} notificationId={notificationId} />
    </div>
  )
}
