"use client"

import { useState } from "react"
import { useInvoices, type InvoiceFilters } from "@/hooks/useInvoices"
import { SearchInput } from "@/components/ui/search-input"
import { Pagination } from "@/components/ui/pagination"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InvoiceListProps {
  orgId: string
  userId: string
}

export function InvoiceList({ orgId, userId }: InvoiceListProps) {
  const [filters, setFilters] = useState<InvoiceFilters>({})
  const { invoices, loading, pagination } = useInvoices(orgId, userId, filters)
  const { isMobile } = useMobile()
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status: status || undefined }))
  }

  const handleDateFilter = () => {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    setFilters((prev) => ({ ...prev, startDate: start, endDate: end }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="w-1/3 h-10 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-1/4 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <div className="w-1/4 h-6 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-1/6 h-6 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-1/3 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-1/5 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <SearchInput placeholder="Search invoices..." onSearch={handleSearch} className="w-full" />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Status filter */}
          <Select value={filters.status || ""} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          {/* Date filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Date Range</span>
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-4" align="start">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label htmlFor="start-date" className="text-sm font-medium">
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="end-date" className="text-sm font-medium">
                    End Date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleDateFilter}>
                  Apply Filter
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">No invoices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Link
              href={`/[orgId]/dashboard/client/invoices/${invoice._id}`}
              as={`/${orgId}/dashboard/client/invoices/${invoice._id}`}
              key={invoice._id}
              className="block border p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h3 className="font-medium">Invoice #{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(invoice.createdAt)} • {invoice.description}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                  <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
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
