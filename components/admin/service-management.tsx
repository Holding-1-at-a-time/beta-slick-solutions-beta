"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { AddService } from "./add-service"
import { EditService } from "./edit-service"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils/format-currency"

export function ServiceManagement() {
  const services = useQuery(query("listServices")) || []
  const isLoading = !services

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Service Management</h2>

      <div className="mb-6">
        <AddService />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>{formatCurrency(service.basePrice)}</TableCell>
              <TableCell>{service.estimatedDuration} min</TableCell>
              <TableCell>
                <EditService service={service} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
