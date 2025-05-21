"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { formatDate } from "@/lib/utils/format-date"
import Link from "next/link"

export function DynamicPricingLogDetail({ orgId, logId }: { orgId: string; logId: string }) {
  const { userId } = useAuth()
  const { data: log, isLoading } = useQuery(api.pricing.getPricingLog, orgId, userId as string, logId)

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (!log) {
    return <div className="text-center py-8">Pricing log not found</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Pricing Change</h2>
        <p className="text-gray-600">Updated on {formatDate(log.updatedAt)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Change Details</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-2">
              <p className="text-gray-600">Change Type:</p>
              <p className="font-medium">
                {log.changeType === "service_rate"
                  ? "Service Rate"
                  : log.changeType === "labor_rate"
                    ? "Labor Rate"
                    : "Parts Markup"}
              </p>

              <p className="text-gray-600">Field:</p>
              <p className="font-medium">{log.fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>

              <p className="text-gray-600">Old Value:</p>
              <p className="font-medium">
                {log.changeType === "parts_markup" ? `${log.oldValue}%` : `$${log.oldValue}`}
              </p>

              <p className="text-gray-600">New Value:</p>
              <p className="font-medium">
                {log.changeType === "parts_markup" ? `${log.newValue}%` : `$${log.newValue}`}
              </p>

              <p className="text-gray-600">Change Amount:</p>
              <p className={`font-medium ${log.newValue > log.oldValue ? "text-red-600" : "text-green-600"}`}>
                {log.changeType === "parts_markup"
                  ? `${log.newValue > log.oldValue ? "+" : ""}${(log.newValue - log.oldValue).toFixed(2)}%`
                  : `${log.newValue > log.oldValue ? "+" : ""}$${(log.newValue - log.oldValue).toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Reason for Change</h3>
          <div className="bg-gray-50 p-4 rounded-md min-h-[100px]">
            {log.reason ? <p>{log.reason}</p> : <p className="text-gray-500 italic">No reason provided</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={`/org/${orgId}/dashboard/client/pricing`} className="text-blue-600 hover:text-blue-800">
          Back to Pricing Settings
        </Link>
      </div>
    </div>
  )
}
