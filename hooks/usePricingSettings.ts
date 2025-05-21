"use client"

import { useState, useEffect } from "react"
import { getPricingParams, updatePricingParams } from "@/app/actions/pricing"

export function usePricingSettings(orgId: string, userId: string) {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [orgId, userId])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const params = await getPricingParams()
      setSettings(params)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching pricing parameters:", error)
      setError("Failed to load pricing settings")
      setLoading(false)
    }
  }

  const saveSettings = async (newSettings: any) => {
    try {
      await updatePricingParams(newSettings)
      setSettings(newSettings)
      return true
    } catch (error) {
      console.error("Error updating pricing parameters:", error)
      throw new Error("Failed to save pricing settings")
    }
  }

  return {
    settings,
    loading,
    error,
    saveSettings,
    refreshSettings: fetchSettings,
  }
}
