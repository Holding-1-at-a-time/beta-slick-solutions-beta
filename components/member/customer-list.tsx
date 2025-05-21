"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function CustomerList({
  orgId,
  summary = false,
}: {
  orgId: string
  summary?: boolean
}) {
  const { user } = useUser()
  const userId = user?.id || ""
  const [searchQuery, setSearchQuery] = useState("")

  const customers = useQuery(query("listCustomers"), orgId, userId) || []

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const list = summary ? filteredCustomers.slice(0, 5) : filteredCustomers

  if (!customers && !summary) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!summary && (
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      {list.length === 0 ? (
        <p className="text-muted-foreground">No customers found.</p>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3 hidden md:table-cell">Email</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((customer) => (
                <tr key={customer._id} className="border-t">
                  <td className="p-3">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="p-3 hidden md:table-cell">{customer.email}</td>
                  <td className="p-3 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/${orgId}/dashboard/member/customers/${customer._id}`}>View Details</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {summary && customers.length > 5 && (
        <div className="text-center">
          <Button variant="link" asChild>
            <Link href={`/${orgId}/dashboard/member/customers`}>View all {customers.length} customers</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
