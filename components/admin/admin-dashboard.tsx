"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import Link from "next/link"
import { useParams } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function AdminDashboard() {
  const params = useParams()
  const orgId = params.orgId as string

  const revenueData = useQuery(query("getRevenueByMonth")) || []
  const users = useQuery(query("listUsers")) || []
  const services = useQuery(query("listServices")) || []

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.total, 0)
  const isLoading = !revenueData || !users || !services

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              <li>
                <Link href={`/${orgId}/dashboard/admin/users`} className="text-primary hover:underline">
                  User Management
                </Link>
              </li>
              <li>
                <Link href={`/${orgId}/dashboard/admin/services`} className="text-primary hover:underline">
                  Service Management
                </Link>
              </li>
              <li>
                <Link href={`/${orgId}/dashboard/admin/tenant-settings`} className="text-primary hover:underline">
                  Tenant Settings
                </Link>
              </li>
              <li>
                <Link href={`/${orgId}/dashboard/admin/analytics`} className="text-primary hover:underline">
                  Analytics Overview
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
