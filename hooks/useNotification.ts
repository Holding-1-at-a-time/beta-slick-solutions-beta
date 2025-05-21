import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"

export function useNotification(orgId: string, userId: string, notificationId: string) {
  const notification = useQuery(api.notifications.getNotificationById, { orgId, userId, notificationId })
  const loading = notification === undefined

  const markAsRead = useMutation(api.notifications.markNotificationAsRead)

  const markNotificationAsRead = async () => {
    await markAsRead({ orgId, userId, notificationId })
  }

  return {
    notification,
    loading,
    markNotificationAsRead,
  }
}
