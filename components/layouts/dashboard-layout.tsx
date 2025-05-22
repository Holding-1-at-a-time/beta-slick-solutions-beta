"use client"

import type { ReactNode } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { MobileNav } from "@/components/ui/mobile-nav"

interface DashboardLayoutProps {
  children: ReactNode
  sidebar: ReactNode
}

export function DashboardLayout({ children, sidebar, orgId }: DashboardLayoutProps & { orgId: string }) {
  const { isMobile } = useMobile()

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={isMobile ? "hidden" : "w-64 shrink-0"}>{sidebar}</div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="container mx-auto p-4 md:p-6 pb-20">{children}</main>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav orgId={orgId} />
    </div>
  )
}

export default DashboardLayout
