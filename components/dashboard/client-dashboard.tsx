"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function ClientDashboard({ orgId }: { orgId: string }) {
  const { userId } = useAuth()

  const { data: invoices, isLoading: invoicesLoading } = useQuery(
    api.invoices.listInvoices,
    orgId,
    userId as string,
    "sent",
    { limit: 3 },
  )

  const { data: notificationsData, isLoading: notificationsLoading } = useQuery(
    api.notifications.getNotifications,
    orgId,
    userId as string,
    { limit: 5 },
    true,
  )

  const { data: unreadCount } = useQuery(api.notifications.getUnreadNotificationCount, orgId, userId as string)

  const outstandingInvoices = invoices?.invoices || []
  const notifications = notificationsData?.notifications || []

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Client Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Outstanding Invoices Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
            <h2 className="text-lg font-semibold">Outstanding Invoices</h2>
            <Link href={`/org/${orgId}/dashboard/client/invoices`} className="text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="p-4">
            {invoicesLoading ? (
              <LoadingSpinner />
            ) : outstandingInvoices.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No outstanding invoices</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {outstandingInvoices.map((invoice) => (
                  <li key={invoice._id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">INV-{invoice._id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-gray-500">Due: {formatDate(invoice.dueDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(invoice.amount)}</p>
                        <Link
                          href={`/org/${orgId}/dashboard/client/invoices/${invoice._id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Pay Now
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Notifications
              {unreadCount && unreadCount.count > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount.count}
                </span>
              )}
            </h2>
            <Link href={`/org/${orgId}/dashboard/client/notifications`} className="text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="p-4">
            {notificationsLoading ? (
              <LoadingSpinner />
            ) : notifications.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No new notifications</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <li key={notification._id} className="py-3">
                    <Link
                      href={`/org/${orgId}/dashboard/client/notifications/${notification._id}`}
                      className="block hover:bg-gray-50"
                    >
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Pricing Settings Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
            <h2 className="text-lg font-semibold">Pricing Settings</h2>
            <Link href={`/org/${orgId}/dashboard/client/pricing`} className="text-sm hover:underline">
              View Details
            </Link>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              Review and manage your service pricing settings, including labor rates and parts markup.
            </p>
            <Link
              href={`/org/${orgId}/dashboard/client/pricing`}
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Manage Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
