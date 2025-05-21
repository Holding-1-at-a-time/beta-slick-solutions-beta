"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { Users, Settings, BarChart3, Home, Wrench } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const params = useParams()
  const orgId = params.orgId as string

  const navItems = [
    {
      name: "Dashboard",
      href: `/${orgId}/dashboard/admin`,
      icon: Home,
    },
    {
      name: "User Management",
      href: `/${orgId}/dashboard/admin/users`,
      icon: Users,
    },
    {
      name: "Service Management",
      href: `/${orgId}/dashboard/admin/services`,
      icon: Wrench,
    },
    {
      name: "Tenant Settings",
      href: `/${orgId}/dashboard/admin/tenant-settings`,
      icon: Settings,
    },
    {
      name: "Analytics",
      href: `/${orgId}/dashboard/admin/analytics`,
      icon: BarChart3,
    },
  ]

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Admin</h2>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
