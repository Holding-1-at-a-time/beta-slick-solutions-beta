import type React from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
