"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Bell, Calendar, Car, CreditCard, DollarSign, FileText, Home, Settings, User, Wrench } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"

interface ClientSidebarProps {
  orgId: string
  userId: string
}

export function ClientSidebar({ orgId, userId }: ClientSidebarProps) {
  const pathname = usePathname()
  const { notifications } = useNotifications(orgId, userId)
  const unreadCount = notifications.filter((n) => !n.read).length

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: `/${orgId}/dashboard/client`,
      active: pathname === `/${orgId}/dashboard/client`,
    },
    {
      label: "Vehicles",
      icon: Car,
      href: `/${orgId}/dashboard/client/vehicles`,
      active: pathname.includes(`/${orgId}/dashboard/client/vehicles`),
    },
    {
      label: "Appointments",
      icon: Calendar,
      href: `/${orgId}/dashboard/client/appointments`,
      active: pathname.includes(`/${orgId}/dashboard/client/appointments`),
    },
    {
      label: "Invoices",
      icon: CreditCard,
      href: `/${orgId}/dashboard/client/invoices`,
      active: pathname.includes(`/${orgId}/dashboard/client/invoices`),
    },
    {
      label: "Notifications",
      icon: Bell,
      href: `/${orgId}/dashboard/client/notifications`,
      active: pathname.includes(`/${orgId}/dashboard/client/notifications`),
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: "Pricing",
      icon: DollarSign,
      href: `/${orgId}/dashboard/client/pricing`,
      active: pathname.includes(`/${orgId}/dashboard/client/pricing`),
    },
    {
      label: "Documents",
      icon: FileText,
      href: `/${orgId}/dashboard/client/documents`,
      active: pathname.includes(`/${orgId}/dashboard/client/documents`),
    },
    {
      label: "Service History",
      icon: Wrench,
      href: `/${orgId}/dashboard/client/service-history`,
      active: pathname.includes(`/${orgId}/dashboard/client/service-history`),
    },
    {
      label: "Profile",
      icon: User,
      href: `/${orgId}/dashboard/client/profile`,
      active: pathname.includes(`/${orgId}/dashboard/client/profile`),
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/${orgId}/dashboard/client/settings`,
      active: pathname.includes(`/${orgId}/dashboard/client/settings`),
    },
  ]

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white">
      <div className="p-6">
        <Link href={`/${orgId}/dashboard/client`} className="flex items-center gap-2">
          <div className="bg-primary/10 p-1 rounded-md">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Client Portal</h1>
        </Link>
      </div>
      <div className="flex flex-col gap-1 px-2 py-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              route.active
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
            )}
          >
            <route.icon className={cn("h-5 w-5", route.active ? "text-primary" : "text-gray-400")} />
            <span>{route.label}</span>
            {route.badge && (
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {route.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
