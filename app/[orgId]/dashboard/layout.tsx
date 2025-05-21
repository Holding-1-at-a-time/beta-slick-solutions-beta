import type { ReactNode } from "react"
import Sidebar from "@/components/tenant/sidebar"
import Header from "@/components/header"

interface DashboardLayoutProps {
  children: ReactNode
  params: {
    orgId: string
  }
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { orgId } = params

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar orgId={orgId} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
