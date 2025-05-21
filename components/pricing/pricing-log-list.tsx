"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils/format-date"
import { Pagination } from "@/components/ui/pagination"
import { SearchInput } from "@/components/ui/search-input"
import { listPricingLogs } from "@/app/actions/pricing"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import Link from "next/link"

interface PricingLogListProps {
  orgId: string
}

export function PricingLogList({ orgId }: PricingLogListProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  })
  const [filters, setFilters] = useState({
    search: "",
    startDate: undefined as number | undefined,
    endDate: undefined as number | undefined,
  })

  useEffect(() => {
    fetchLogs(1)
  }, [orgId, filters])

  const fetchLogs = async (page: number) => {
    try {
      setLoading(true)
      const result = await listPricingLogs(page, filters)
      setLogs(result.logs)
      setPagination({
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      })
      setLoading(false)
    } catch (error) {
      console.error("Error fetching pricing logs:", error)
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    fetchLogs(page)
  }

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }

  const handleDateFilter = (startDate?: Date, endDate?: Date) => {
    setFilters((prev) => ({
      ...prev,
      startDate: startDate?.getTime(),
      endDate: endDate?.getTime(),
    }))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Logs</CardTitle>
          <CardDescription>Loading pricing logs...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingPlaceholder />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Logs</CardTitle>
        <CardDescription>View history of pricing parameter changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <SearchInput placeholder="Search logs..." onSearch={handleSearch} className="w-full sm:w-1/3" />
            <div className="flex gap-2">
              <input
                type="date"
                className="border rounded-md px-3 py-2"
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined
                  handleDateFilter(date, filters.endDate ? new Date(filters.endDate) : undefined)
                }}
                placeholder="Start Date"
              />
              <input
                type="date"
                className="border rounded-md px-3 py-2"
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined
                  handleDateFilter(filters.startDate ? new Date(filters.startDate) : undefined, date)
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
                  href={`/${orgId}/dashboard/client/pricing/log/${log._id}`}
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
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
