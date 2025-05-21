"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils/format-date"
import Link from "next/link"

export function PricingLogsList({ orgId }: { orgId: string }) {
  const { userId } = useAuth()
  const { data, isLoading } = useQuery(api.pricing.getPricingLogs, orgId, userId as string, { limit: 10 })
  const logs = data?.logs || []

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No pricing changes have been made yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Change Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Old Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              New Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log._id}>
              <td className="px-6 py-4 whitespace-nowrap">{formatDate(log.updatedAt)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.changeType === "service_rate"
                  ? "Service Rate"
                  : log.changeType === "labor_rate"
                    ? "Labor Rate"
                    : "Parts Markup"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.changeType === "parts_markup" ? `${log.oldValue}%` : `$${log.oldValue}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {log.changeType === "parts_markup" ? `${log.newValue}%` : `$${log.newValue}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/org/${orgId}/dashboard/client/pricing/log/${log._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
