"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Settings, Users, Wrench, Home, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

export function AdminSidebar() {
  const pathname = usePathname()
  const params = useParams()
  const orgId = params.orgId as string

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    settings: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const isActive = (path: string) => {
    return pathname === `/${orgId}/dashboard/admin${path}`
  }

  const navItems = [
    {
      title: "Dashboard",
      href: `/${orgId}/dashboard/admin`,
      icon: <Home className="h-5 w-5" />,
      exact: true,
    },
    {
      title: "User Management",
      href: `/${orgId}/dashboard/admin/users`,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Service Management",
      href: `/${orgId}/dashboard/admin/services`,
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: `/${orgId}/dashboard/admin/analytics`,
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ]

  const settingsItems = [
    {
      title: "Tenant Settings",
      href: `/${orgId}/dashboard/admin/tenant-settings`,
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="h-full py-6 flex flex-col">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Admin Portal</h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  (item.exact ? pathname === item.href : pathname.startsWith(item.href)) && "bg-muted font-medium",
                )}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            </Link>
          ))}

          <Collapsible open={openSections.settings} onOpenChange={() => toggleSection("settings")} className="w-full">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-5 w-5" />
                <span className="ml-2">Settings</span>
                <span className="ml-auto">
                  {openSections.settings ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-6 space-y-1">
              {settingsItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start", pathname.startsWith(item.href) && "bg-muted font-medium")}
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Button>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
