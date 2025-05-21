"use client"

import { useRouter } from "next/navigation"
import { useInvoices } from "@/hooks/useInvoices"
import { useNotifications } from "@/hooks/useNotifications"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDistanceToNow } from "@/lib/utils/format-date"
import { Bell, Calendar, Car, CreditCard } from "lucide-react"
import Link from "next/link"
import { useMobile } from "@/hooks/use-mobile"

interface ClientDashboardProps {
  orgId: string
  userId: string
}

export function ClientDashboard({ orgId, userId }: ClientDashboardProps) {
  const router = useRouter()
  const { invoices, loading: invoicesLoading } = useInvoices(orgId, userId, { status: "pending" }, 1, 3)
  const { notifications, loading: notificationsLoading } = useNotifications(orgId, userId)
  const { isMobile, isXs } = useMobile()

  const unreadNotifications = notifications.filter((n) => !n.read)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link href={`/${orgId}/dashboard/client/notifications`}>
            <Button variant="outline" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications.length > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
                  variant="destructive"
                >
                  {unreadNotifications.length}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className={isXs ? "p-4" : undefined}>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-500" /> My Vehicles
            </CardTitle>
            <CardDescription>Manage your registered vehicles</CardDescription>
          </CardHeader>
          <CardContent className={isXs ? "p-4 pt-0" : undefined}>
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-gray-500">Registered vehicles</p>
          </CardContent>
          <CardFooter className={isXs ? "p-4 pt-0" : undefined}>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/${orgId}/dashboard/client/vehicles`)}
            >
              View Vehicles
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className={isXs ? "p-4" : undefined}>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" /> Appointments
            </CardTitle>
            <CardDescription>Upcoming service appointments</CardDescription>
          </CardHeader>
          <CardContent className={isXs ? "p-4 pt-0" : undefined}>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-gray-500">Upcoming appointments</p>
          </CardContent>
          <CardFooter className={isXs ? "p-4 pt-0" : undefined}>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/${orgId}/dashboard/client/appointments`)}
            >
              View Appointments
            </Button>
          </CardFooter>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className={isXs ? "p-4" : undefined}>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-yellow-500" /> Invoices
            </CardTitle>
            <CardDescription>Outstanding payments</CardDescription>
          </CardHeader>
          <CardContent className={isXs ? "p-4 pt-0" : undefined}>
            <p className="text-2xl font-bold">{invoicesLoading ? "..." : invoices.length}</p>
            <p className="text-sm text-gray-500">Pending invoices</p>
          </CardContent>
          <CardFooter className={isXs ? "p-4 pt-0" : undefined}>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/${orgId}/dashboard/client/invoices`)}
            >
              View Invoices
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className={isXs ? "p-4" : undefined}>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent className={isXs ? "p-4 pt-0" : undefined}>
            {invoicesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 animate-pulse rounded"></div>
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending invoices</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <Link
                    key={invoice._id}
                    href={`/${orgId}/dashboard/client/invoices/${invoice._id}`}
                    className="block p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <div>
                        <p className="font-medium">Invoice #{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                        <Badge
                          variant={
                            invoice.status === "overdue"
                              ? "destructive"
                              : invoice.status === "pending"
                                ? "outline"
                                : "default"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className={isXs ? "p-4 pt-0" : undefined}>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/${orgId}/dashboard/client/invoices`)}
            >
              View All Invoices
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className={isXs ? "p-4" : undefined}>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className={isXs ? "p-4 pt-0" : undefined}>
            {notificationsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 animate-pulse rounded"></div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification) => {
                  const link = notification.entityId
                    ? `/${orgId}/dashboard/client/notifications/${notification._id}`
                    : `/${orgId}/dashboard/client/notifications`

                  return (
                    <Link key={notification._id} href={link} className="block p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <Bell className={`h-5 w-5 mt-0.5 ${notification.read ? "text-gray-400" : "text-blue-500"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{notification.title}</p>
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{notification.message}</p>
                            <p className="text-xs text-gray-400">{formatDistanceToNow(notification.createdAt)} ago</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className={isXs ? "p-4 pt-0" : undefined}>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/${orgId}/dashboard/client/notifications`)}
            >
              View All Notifications
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
