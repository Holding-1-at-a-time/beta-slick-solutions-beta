"use client"

import { usePricingLog } from "@/hooks/usePricingLog"
import { formatDate } from "@/lib/utils/format-date"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatCurrency } from "@/lib/utils/format-currency"
import Link from "next/link"

interface DynamicPricingLogDetailProps {
  orgId: string
  userId: string
  logId: string
}

export function DynamicPricingLogDetail({ orgId, userId, logId }: DynamicPricingLogDetailProps) {
  const { log, loading } = usePricingLog(orgId, userId, logId)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  if (!log) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Pricing log not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pricing Log Details</h1>
        <Link
          href={`/[orgId]/dashboard/client/pricing`}
          as={`/${orgId}/dashboard/client/pricing`}
          className="text-blue-600 hover:underline"
        >
          Back to Pricing
        </Link>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date</h3>
            <p>{formatDate(log.timestamp)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">User</h3>
            <p>{log.user?.name || "Unknown User"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Action</h3>
            <p className="capitalize">{log.action}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">Settings</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Base Service Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(log.settings.baseRates).map(([service, rate]) => (
              <div key={service} className="flex items-center justify-between">
                <span className="capitalize">{service.replace(/_/g, " ")}</span>
                <span className="font-medium">{formatCurrency(rate as number)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Labor Rate</h3>
          <p>{formatCurrency(log.settings.laborRate)}/hour</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Parts Markup</h3>
          <p>
            {log.settings.markup}× (equivalent to {((log.settings.markup - 1) * 100).toFixed(0)}% markup)
          </p>
        </div>
      </div>

      {log.aiRoute && (
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">AI Processing</h2>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">AI Route</h3>
            <p>{log.aiRoute}</p>
          </div>
          {log.aiParameters && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Parameters</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                {JSON.stringify(log.aiParameters, null, 2)}
              </pre>
            </div>
          )}
          {log.aiOutput && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Output</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{JSON.stringify(log.aiOutput, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
