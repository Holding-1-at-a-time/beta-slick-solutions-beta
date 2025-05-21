"use client"

import { useCustomers } from "@/hooks/useMember"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Search } from "lucide-react"

export default function CustomerList({ summary = false }: { summary?: boolean }) {
  const { customers, isLoading } = useCustomers()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase()
    const email = customer.email.toLowerCase()
    const query = searchQuery.toLowerCase()

    return fullName.includes(query) || email.includes(query)
  })

  const displayCustomers = summary ? filteredCustomers.slice(0, 5) : filteredCustomers

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(summary ? 5 : 10)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vehicles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              displayCustomers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <Link
                      href={`./member/customers/${customer._id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {customer.firstName} {customer.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || "—"}</TableCell>
                  <TableCell>{customer.vehicleCount || "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Summary view
  return (
    <ul className="space-y-2">
      {displayCustomers.length === 0 ? (
        <li className="text-gray-500 text-sm">No customers found</li>
      ) : (
        displayCustomers.map((customer) => (
          <li key={customer._id}>
            <Link
              href={`./member/customers/${customer._id}`}
              className="block hover:bg-gray-50 rounded p-2 transition-colors"
            >
              <p className="font-medium">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-sm text-gray-600">{customer.email}</p>
            </Link>
          </li>
        ))
      )}
      {summary && customers.length > 5 && (
        <li className="text-center">
          <Link href="./member/customers" className="text-blue-600 hover:underline text-sm">
            View all {customers.length} customers
          </Link>
        </li>
      )}
    </ul>
  )
}
