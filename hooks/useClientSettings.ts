"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"

export function useClientSettings(orgId: string, userId: string) {
  const settings = useQuery(api.clientSettings.getClientSettings, { orgId, userId })
  const updateBranding = useMutation(api.clientSettings.updateClientBranding)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateClientBranding = async (branding: {
    primaryColor?: string
    secondaryColor?: string
    logo?: string
    darkMode?: boolean
  }) => {
    setIsUpdating(true)
    try {
      await updateBranding({
        orgId,
        userId,
        branding,
      })
      return { success: true }
    } catch (error) {
      console.error("Error updating branding:", error)
      return { success: false, error }
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    settings,
    updateClientBranding,
    isUpdating,
  }
}
