"use client"

import { useCustomers } from "@/hooks/useMember"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomerList({ summary = false }: { summary?: boolean }) {
  const { customers, isLoading } = useCustomers();
  const list = summary ? customers.slice(0, 5) : customers;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(summary ? 5 : 10)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (list.length === 0) {
    return <p className="text-gray-500 text-sm">No customers found.</p>;
  }

  if (summary) {
    return (
      <div className="space-y-3">
        {list.map((customer) => (
          <Link 
            key={customer._id}
            href={`./member/customers/${customer._id}`}
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={customer.imageUrl || "/placeholder.svg"} alt={`${customer.firstName} ${customer.lastName}`} />
              <AvatarFallback>
                {customer.firstName?.[0]}{customer.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{customer.firstName} {customer.lastName}</p>
              <p className="text-xs text-gray-500">{customer.email}</p>
            </div>
          </Link>
        ))}
        {customers.length > 5 && (
          <Link href="./member/customers" className="block text-center text-blue-600 hover:underline text-sm mt-2">
            View all {customers.length} customers
          </Link\
