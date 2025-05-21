"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePermissions } from "@/hooks/use-permissions"
import { Home, Car, Calendar, FileText, Settings, Users, BarChart, Menu, X, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps {
  orgId: string
}

export default function Sidebar({ orgId }: SidebarProps) {
  const pathname = usePathname()
  const { isAdmin, isMember, can } = usePermissions()
  const [isOpen, setIsOpen] = useState(false)
  const { isMobile, isMobileOrTablet } = useMobile()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
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

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobile, isOpen])

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
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      {isMobileOrTablet && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 lg:hidden bg-white/80 backdrop-blur-sm shadow-sm border"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          ref={sidebarRef}
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg lg:shadow-none transition-transform lg:translate-x-0 lg:static lg:w-64 lg:shrink-0",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
          initial={isMobileOrTablet ? { x: "-100%" } : false}
          animate={isMobileOrTablet ? { x: isOpen ? 0 : "-100%" } : {}}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Navigation</h2>
              {isMobileOrTablet && (
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
            <ScrollArea className="flex-1 touch-auto">
              <nav className="p-4 space-y-1">
                {routes.map((route) => {
                  // Skip if permission is required but user doesn't have it
                  if (route.permission && !can(route.permission)) {
                    return null
                  }

                  const isActive = pathname === route.href

                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <route.icon className="h-5 w-5" />
                        {route.title}
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>
            <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
              <p>© 2023 SaaS Platform</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
