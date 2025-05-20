import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { UserWelcome } from "@/components/dashboard/user-welcome"

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fetch user-specific dashboard data
  const dashboardData = await fetchQuery(api.queries.getDashboardData, {
    userId: user.id,
  })

  // Fetch user's organization data if they belong to any
  const organizations =
    user.organizationMemberships?.map((membership) => ({
      id: membership.organization.id,
      name: membership.organization.name,
      role: membership.role,
    })) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <UserWelcome firstName={user.firstName || ""} lastName={user.lastName || ""} imageUrl={user.imageUrl} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <DashboardStats
          vehicleCount={dashboardData?.vehicleCount || 0}
          appointmentCount={dashboardData?.appointmentCount || 0}
          invoiceCount={dashboardData?.invoiceCount || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <UpcomingAppointments appointments={dashboardData?.upcomingAppointments || []} />
        <RecentActivity activities={dashboardData?.recentActivities || []} />
      </div>

      {organizations.length > 0 && (
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Your Organizations</h2>
          <ul className="divide-y divide-gray-200">
            {organizations.map((org) => (
              <li key={org.id} className="py-3 flex justify-between items-center">
                <span>{org.name}</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                  {org.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
