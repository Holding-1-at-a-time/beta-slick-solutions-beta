"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { PricingLogsList } from "./pricing-logs-list"

export function PricingSettings({ orgId }: { orgId: string }) {
  const { userId } = useAuth()
  const { data: settings, isLoading } = useQuery(api.pricing.getPricingSettings, orgId, userId as string)
  const updatePricing = useMutation(api.pricing.updatePricingSettings)

  const [formData, setFormData] = useState({
    serviceRates: {
      diagnostic: 0,
      repair: 0,
      maintenance: 0,
    },
    laborRates: {
      standard: 0,
      premium: 0,
      emergency: 0,
    },
    partsMarkup: 0,
    reason: "",
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        serviceRates: { ...settings.serviceRates },
        laborRates: { ...settings.laborRates },
        partsMarkup: settings.partsMarkup,
        reason: "",
      })
    }
  }, [settings])

  const handleServiceRateChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceRates: {
        ...prev.serviceRates,
        [field]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const handleLaborRateChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      laborRates: {
        ...prev.laborRates,
        [field]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const handlePartsMarkupChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      partsMarkup: Number.parseFloat(value) || 0,
    }))
  }

  const handleReasonChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      reason: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updatePricing(
      orgId,
      userId as string,
      formData.serviceRates,
      formData.laborRates,
      formData.partsMarkup,
      formData.reason,
    )
    setFormData((prev) => ({ ...prev, reason: "" }))
  }

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Rates (per hour)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnostic Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.serviceRates.diagnostic}
                  onChange={(e) => handleServiceRateChange("diagnostic", e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repair Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.serviceRates.repair}
                  onChange={(e) => handleServiceRateChange("repair", e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.serviceRates.maintenance}
                  onChange={(e) => handleServiceRateChange("maintenance", e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Labor Rates (per hour)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.laborRates.standard}
                  onChange={(e) => handleLaborRateChange("standard", e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.laborRates.premium}
                  onChange={(e) => handleLaborRateChange("premium", e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.laborRates.emergency}
                  onChange={(e) => handleLaborRateChange("emergency", e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Parts Markup</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Markup Percentage (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.partsMarkup}
              onChange={(e) => handlePartsMarkupChange(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change</label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleReasonChange(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm p-2"
            rows={3}
            placeholder="Explain why you're updating these rates..."
            required
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Update Pricing
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-4">Pricing History</h2>
        <PricingLogsList orgId={orgId} />
      </div>
    </div>
  )
}
