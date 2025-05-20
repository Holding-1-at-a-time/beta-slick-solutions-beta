"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Car, Calendar, FileText, Bell, Settings, CreditCard } from "lucide-react"

interface ClientSidebarProps {
  orgId: string
}

export default function ClientSidebar({ orgId }: ClientSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      href: `/org/${orgId}/dashboard/client`,
      icon: Car,
    },
    {
      title: "Vehicles",
      href: `/org/${orgId}/dashboard/client/vehicles`,
      icon: Car,
    },
    {
      title: "Appointments",
      href: `/org/${orgId}/dashboard/client/appointments`,
      icon: Calendar,
    },
    {
      title: "Invoices",
      href: `/org/${orgId}/dashboard/client/invoices`,
      icon: FileText,
    },
    {
      title: "Pricing",
      href: `/org/${orgId}/dashboard/client/pricing`,
      icon: CreditCard,
    },
    {
      title: "Notifications",
      href: `/org/${orgId}/dashboard/client/notifications`,
      icon: Bell,
    },
    {
      title: "Settings",
      href: `/org/${orgId}/dashboard/client/settings`,
      icon: Settings,
    },
  ]

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-white">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-primary">Client Portal</h2>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {routes.map((route) => (
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
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
