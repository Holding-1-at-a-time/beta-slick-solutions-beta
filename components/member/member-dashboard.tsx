"use client"

import { MemberAppointments } from "@/components/member"
import { PendingAssessments } from "@/components/member"
import { CustomerList } from "@/components/member"
import { Card } from "@/components/ui/card"
import { useMemberNotifications } from "@/hooks/useMember"

export default function MemberDashboard() {
  const { notifications, unreadCount } = useMemberNotifications()

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Member Dashboard</h1>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">{unreadCount} unread notifications</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
          <MemberAppointments summary />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Pending Assessments</h2>
          <PendingAssessments summary />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Customers</h2>
          <CustomerList summary />
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
        <ul className="divide-y">
          {notifications.slice(0, 5).map((notification) => (
            <li key={notification._id} className={`py-3 ${notification.isRead ? "" : "font-medium"}`}>
              <p className="text-sm">{notification.title}</p>
              <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
