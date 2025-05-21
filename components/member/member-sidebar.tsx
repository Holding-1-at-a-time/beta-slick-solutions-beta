"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemberNotifications } from "@/hooks/useMember"
import { Calendar, ClipboardList, Users, BarChart, Settings, Home, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SidebarItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: number
}

export default function MemberSidebar() {
  const pathname = usePathname()
  const { unreadCount } = useMemberNotifications()
  const orgId = pathname.split("/")[1] // Extract orgId from URL

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: `/${orgId}/dashboard/member`,
      icon: Home,
    },
    {
      name: "Appointments",
      href: `/${orgId}/dashboard/member/appointments`,
      icon: Calendar,
    },
    {
      name: "Assessments",
      href: `/${orgId}/dashboard/member/assessments/pending`,
      icon: ClipboardList,
    },
    {
      name: "Customers",
      href: `/${orgId}/dashboard/member/customers`,
      icon: Users,
    },
    {
      name: "Analytics",
      href: `/${orgId}/dashboard/member/analytics`,
      icon: BarChart,
    },
    {
      name: "Notifications",
      href: `/${orgId}/dashboard/member/notifications`,
      icon: Bell,
      badge: unreadCount,
    },
    {
      name: "Settings",
      href: `/${orgId}/dashboard/member/settings`,
      icon: Settings,
    },
  ]

  return (
    <div className="h-full py-6 px-3 space-y-6">
      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold">Member Portal</h2>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
              {item.badge && item.badge > 0 && (
                <Badge className="ml-auto bg-red-500 hover:bg-red-600">{item.badge}</Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
