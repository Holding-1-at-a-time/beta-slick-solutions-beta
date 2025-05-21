import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"

export function useNotifications(orgId: string, userId: string) {
  const notifications = useQuery(api.notifications.listNotifications, { orgId, userId }) || []
  const loading = notifications === undefined

  const markAsRead = useMutation(api.notifications.markNotificationAsRead)
  const deleteNotification = useMutation(api.notifications.deleteNotification)

  const markNotificationAsRead = async (notificationId: string) => {
    await markAsRead({ orgId, userId, notificationId })
  }

  const removeNotification = async (notificationId: string) => {
    await deleteNotification({ orgId, userId, notificationId })
  }

  return {
    notifications,
    loading,
    markNotificationAsRead,
    removeNotification,
  }
}
