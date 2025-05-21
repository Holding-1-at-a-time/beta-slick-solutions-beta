"use client"

import { usePricingLogs, type PricingLogFilters } from "@/hooks/usePricingLogs"
import { useState } from "react"
import { formatDate } from "@/lib/utils/format-date"
import { Pagination } from "@/components/ui/pagination"
import { SearchInput } from "@/components/ui/search-input"
import Link from "next/link"

interface PricingLogsListProps {
  orgId: string
  userId: string
}

export function PricingLogsList({ orgId, userId }: PricingLogsListProps) {
  const [filters, setFilters] = useState<PricingLogFilters>({})
  const { logs, loading, pagination } = usePricingLogs(orgId, userId, filters)

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }

  const handleDateFilter = (startDate?: Date, endDate?: Date) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="w-1/3 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-1/4 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="border-t p-4">
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchInput placeholder="Search logs..." onSearch={handleSearch} className="w-full sm:w-1/3" />
        <div className="flex gap-2">
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined
              handleDateFilter(date, filters.endDate)
            }}
            placeholder="Start Date"
          />
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined
              handleDateFilter(filters.startDate, date)
            }}
            placeholder="End Date"
          />
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">No pricing logs found</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 font-medium">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">Date</div>
              <div className="col-span-3">User</div>
              <div className="col-span-3">Action</div>
              <div className="col-span-3">Details</div>
            </div>
          </div>
          {logs.map((log) => (
            <Link
              href={`/[orgId]/dashboard/client/pricing/log/${log._id}`}
              as={`/${orgId}/dashboard/client/pricing/log/${log._id}`}
              key={log._id}
              className="block border-t hover:bg-gray-50 transition-colors"
            >
              <div className="p-4 grid grid-cols-12 gap-4">
                <div className="col-span-3">{formatDate(log.timestamp)}</div>
                <div className="col-span-3">{log.user?.name || "Unknown User"}</div>
                <div className="col-span-3 capitalize">{log.action}</div>
                <div className="col-span-3">
                  <span className="text-blue-600 hover:underline">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
        />
      )}
    </div>
  )
}
