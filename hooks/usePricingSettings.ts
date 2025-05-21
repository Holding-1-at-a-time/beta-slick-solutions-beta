import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"

export function usePricingSettings(orgId: string, userId: string) {
  const settings = useQuery(api.pricing.getPricingSettings, { orgId, userId })
  const loading = settings === undefined

  const updateSettings = useMutation(api.pricing.updatePricingSettings)

  const saveSettings = async (newSettings: {
    baseRates: Record<string, number>
    laborRate: number
    markup: number
  }) => {
    await updateSettings({ orgId, userId, settings: newSettings })
  }

  return {
    settings,
    loading,
    saveSettings,
  }
}
