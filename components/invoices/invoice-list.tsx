"use client"

import { useState } from "react"
import { useInvoices, type InvoiceFilters } from "@/hooks/useInvoices"
import { SearchInput } from "@/components/ui/search-input"
import { Pagination } from "@/components/ui/pagination"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface InvoiceListProps {
  orgId: string
  userId: string
}

export function InvoiceList({ orgId, userId }: InvoiceListProps) {
  const [filters, setFilters] = useState<InvoiceFilters>({})
  const { invoices, loading, pagination } = useInvoices(orgId, userId, filters)

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status: status || undefined }))
  }

  const handleDateFilter = (startDate?: Date, endDate?: Date) => {
    setFilters((prev) => ({ ...prev, startDate, endDate }))
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
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchInput placeholder="Search invoices..." onSearch={handleSearch} className="w-full sm:w-1/3" />
        <div className="flex gap-2">
          <select
            className="border rounded-md px-3 py-2"
            onChange={(e) => handleStatusFilter(e.target.value)}
            value={filters.status || ""}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined
              handleDateFilter(date, filters.endDate)
            }}
          />
          <input
            type="date"
            className="border rounded-md px-3 py-2"
            onChange={(e) => {
              const date = e.target.value ? new Date(e.target.value) : undefined
              handleDateFilter(filters.startDate, date)
            }}
          />
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
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Invoice #{invoice.invoiceNumber}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(invoice.createdAt)} • {invoice.description}
                  </p>
                </div>
                <div className="text-right">
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
