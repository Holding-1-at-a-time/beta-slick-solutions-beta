"use client"

import type React from "react"
import { ClientSidebar } from "@/components/tenant/client-sidebar"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  const isMobile = useMobile()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`${isMobile ? "hidden" : "w-64"} bg-gray-900 text-white`}>{sidebar || <ClientSidebar />}</div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
