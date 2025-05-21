"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { SearchInput } from "@/components/ui/search-input"
import { Pagination } from "@/components/ui/pagination"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"
import Link from "next/link"

export function InvoiceList({ orgId }: { orgId: string }) {
  const { userId } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // Use the appropriate query based on whether we're searching or not
  const queryFn = searchTerm ? api.invoices.searchInvoices : api.invoices.listInvoices
  const queryArgs = searchTerm
    ? [orgId, userId as string, searchTerm, { limit: pageSize }]
    : [orgId, userId as string, statusFilter, { limit: pageSize }]

  const { data, isLoading } = useQuery(queryFn, ...queryArgs)
  const invoices = data?.invoices || []
  const hasNextPage = !!data?.continueCursor

  const payInvoice = useMutation(api.invoices.payInvoice)

  const handlePayInvoice = async (invoiceId: string) => {
    await payInvoice(orgId, userId as string, invoiceId, "credit_card")
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setStatusFilter(value === "all" ? null : value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // TODO: Handle pagination with cursor
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchInput placeholder="Search invoices..." value={searchTerm} onChange={handleSearch} />
        <select className="border rounded p-2" value={statusFilter || "all"} onChange={handleFilterChange}>
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No invoices found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/org/${orgId}/dashboard/client/invoices/${invoice._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        INV-{invoice._id.slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(invoice.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(invoice.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : invoice.status === "sent"
                                ? "bg-blue-100 text-blue-800"
                                : invoice.status === "draft"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.status === "sent" || invoice.status === "overdue" ? (
                        <button
                          onClick={() => handlePayInvoice(invoice._id)}
                          className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <Link
                          href={`/org/${orgId}/dashboard/client/invoices/${invoice._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(invoices.length / pageSize)}
            onPageChange={handlePageChange}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </div>
  )
}
