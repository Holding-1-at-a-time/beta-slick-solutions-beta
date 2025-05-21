"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ClientSidebar({ orgId }: { orgId: string }) {
  const { userId } = useAuth()
  const pathname = usePathname()

  const { data: unreadCount } = useQuery(api.notifications.getUnreadNotificationCount, orgId, userId as string)

  const navItems = [
    {
      name: "Dashboard",
      href: `/org/${orgId}/dashboard/client`,
      icon: "home",
    },
    {
      name: "Vehicles",
      href: `/org/${orgId}/dashboard/client/vehicles`,
      icon: "car",
    },
    {
      name: "Appointments",
      href: `/org/${orgId}/dashboard/client/appointments`,
      icon: "calendar",
    },
    {
      name: "Invoices",
      href: `/org/${orgId}/dashboard/client/invoices`,
      icon: "file-text",
    },
    {
      name: "Pricing",
      href: `/org/${orgId}/dashboard/client/pricing`,
      icon: "dollar-sign",
    },
    {
      name: "Notifications",
      href: `/org/${orgId}/dashboard/client/notifications`,
      icon: "bell",
      badge: unreadCount?.count || 0,
    },
    {
      name: "Settings",
      href: `/org/${orgId}/dashboard/client/settings`,
      icon: "settings",
    },
  ]

  return (
    <div className="w-64 bg-gray-800 text-white h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Client Portal</h2>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    pathname === item.href ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <span className="mr-3">{/* Icon would go here */}</span>
                  <span>{item.name}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
