"use client"

import type React from "react"

import { usePricingSettings } from "@/hooks/usePricingSettings"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface PricingSettingsProps {
  orgId: string
  userId: string
}

export function PricingSettings({ orgId, userId }: PricingSettingsProps) {
  const { settings, loading, saveSettings } = usePricingSettings(orgId, userId)
  const [formData, setFormData] = useState<{
    baseRates: Record<string, number>
    laborRate: number
    markup: number
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data when settings are loaded
  if (settings && !formData) {
    setFormData({
      baseRates: { ...settings.baseRates },
      laborRate: settings.laborRate,
      markup: settings.markup,
    })
  }

  const handleBaseRateChange = (service: string, value: string) => {
    if (!formData) return

    setFormData({
      ...formData,
      baseRates: {
        ...formData.baseRates,
        [service]: Number.parseFloat(value) || 0,
      },
    })
  }

  const handleLaborRateChange = (value: string) => {
    if (!formData) return

    setFormData({
      ...formData,
      laborRate: Number.parseFloat(value) || 0,
    })
  }

  const handleMarkupChange = (value: string) => {
    if (!formData) return

    setFormData({
      ...formData,
      markup: Number.parseFloat(value) || 1,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    try {
      setIsSubmitting(true)
      await saveSettings(formData)
      toast({
        title: "Settings saved",
        description: "Your pricing settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pricing settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !formData) {
    return (
      <div className="border rounded-lg p-6 space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Base Service Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.baseRates).map(([service, rate]) => (
            <div key={service} className="flex items-center justify-between">
              <label className="font-medium capitalize">{service.replace(/_/g, " ")}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={rate}
                  onChange={(e) => handleBaseRateChange(service, e.target.value)}
                  className="border rounded-md pl-8 pr-4 py-2 w-32"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Labor Rate</h3>
        <div className="flex items-center">
          <label className="font-medium mr-4">Hourly Rate</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.laborRate}
              onChange={(e) => handleLaborRateChange(e.target.value)}
              className="border rounded-md pl-8 pr-4 py-2 w-32"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Parts Markup</h3>
        <div className="flex items-center">
          <label className="font-medium mr-4">Markup Multiplier</label>
          <div className="relative">
            <input
              type="number"
              min="1"
              step="0.01"
              value={formData.markup}
              onChange={(e) => handleMarkupChange(e.target.value)}
              className="border rounded-md px-4 py-2 w-32"
            />
            <span className="absolute right-8 top-1/2 transform -translate-y-1/2">×</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Example: A markup of 1.2 means parts cost will be multiplied by 1.2 (20% markup)
        </p>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  )
}
