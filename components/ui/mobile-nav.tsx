"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Car, Calendar, FileText, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"

interface MobileNavProps {
  orgId: string
}

export function MobileNav({ orgId }: MobileNavProps) {
  const pathname = usePathname()
  const { isMobile } = useMobile()

  if (!isMobile) return null

  const routes = [
    {
      href: `/org/${orgId}/dashboard`,
      label: "Home",
      icon: Home,
    },
    {
      href: `/org/${orgId}/vehicles`,
      label: "Vehicles",
      icon: Car,
    },
    {
      href: `/org/${orgId}/appointments`,
      label: "Calendar",
      icon: Calendar,
    },
    {
      href: `/org/${orgId}/invoices`,
      label: "Invoices",
      icon: FileText,
    },
    {
      href: `/org/${orgId}/settings`,
      label: "Menu",
      icon: Menu,
    },
  ]

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg lg:hidden"
    >
      <nav className="flex h-16 items-center justify-around">
        {routes.map((route) => {
          const isActive = pathname === route.href
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-2",
                isActive ? "text-primary" : "text-gray-500",
              )}
            >
              <route.icon className="h-6 w-6" />
              <span className="mt-1 text-xs">{route.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 h-1 w-12 rounded-full bg-primary"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </Link>
          )
        })}
      </nav>
    </motion.div>
  )
}
