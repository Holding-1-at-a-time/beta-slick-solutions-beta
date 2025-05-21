"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MemberAppointments } from "./member-appointments"
import { PendingAssessments } from "./pending-assessments"
import { CustomerList } from "./customer-list"

export function MemberDashboard() {
  const params = useParams()
  const orgId = params.orgId as string

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Member Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <MemberAppointments orgId={orgId} summary />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <PendingAssessments orgId={orgId} summary />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerList orgId={orgId} summary />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
