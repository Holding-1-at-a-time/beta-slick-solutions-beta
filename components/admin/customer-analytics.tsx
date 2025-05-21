"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export function CustomerAnalytics() {
  const customerData = useQuery(query("getCustomerAcquisitionMetrics")) || []
  const isLoading = !customerData

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Acquisition & Retention</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  // Sort data by month
  const sortedData = [...customerData].sort((a, b) => {
    return a.month.localeCompare(b.month)
  })

  // Format data for chart
  const chartData = sortedData.map((item) => ({
    name: item.month,
    new: item.newCustomers,
    retained: item.retained,
    churned: item.churned,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Acquisition & Retention</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" name="New Customers" fill="#00AE98" />
              <Bar dataKey="retained" name="Retained" fill="#4CAF50" />
              <Bar dataKey="churned" name="Churned" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>New</TableHead>
              <TableHead>Retained</TableHead>
              <TableHead>Churned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                <TableCell>{row.newCustomers}</TableCell>
                <TableCell>{row.retained}</TableCell>
                <TableCell>{row.churned}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
