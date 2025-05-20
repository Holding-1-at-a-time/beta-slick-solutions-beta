"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePermissions } from "@/hooks/use-permissions"
import { Home, Car, Calendar, FileText, Settings, Users, BarChart, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface SidebarProps {
  orgId: string
}

export default function Sidebar({ orgId }: SidebarProps) {
  const pathname = usePathname()
  const { isAdmin, isMember, can } = usePermissions()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar")
      if (isMobile && isOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, isOpen])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [pathname, isMobile])

  const routes = [
    {
      title: "Dashboard",
      href: `/org/${orgId}/dashboard`,
      icon: Home,
      permission: null, // Everyone can access
    },
    {
      title: "Vehicles",
      href: `/org/${orgId}/vehicles`,
      icon: Car,
      permission: "org:vehicles:read",
    },
    {
      title: "Appointments",
      href: `/org/${orgId}/appointments`,
      icon: Calendar,
      permission: "org:appointments:read",
    },
    {
      title: "Invoices",
      href: `/org/${orgId}/invoices`,
      icon: FileText,
      permission: "org:invoices:read",
    },
    // Admin and member only routes
    ...(isAdmin || isMember
      ? [
          {
            title: "Users",
            href: `/org/${orgId}/users`,
            icon: Users,
            permission: "org:users:read",
          },
          {
            title: "Analytics",
            href: `/org/${orgId}/analytics`,
            icon: BarChart,
            permission: "org:insights:read",
          },
        ]
      : []),
    // Admin only routes
    ...(isAdmin
      ? [
          {
            title: "Settings",
            href: `/org/${orgId}/settings`,
            icon: Settings,
            permission: "org:tenants:manage",
          },
        ]
      : []),
  ]

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed left-4 top-4 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-primary">Navigation</h2>
          </div>
          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-1">
              {routes.map((route) => {
                // Skip if permission is required but user doesn't have it
                if (route.permission && !can(route.permission)) {
                  return null
                }

                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === route.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.title}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
