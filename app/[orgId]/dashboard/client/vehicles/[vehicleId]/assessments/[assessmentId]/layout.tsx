import type React from "react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"

interface AssessmentLayoutProps {
  children: React.ReactNode
  params: {
    orgId: string
    vehicleId: string
    assessmentId: string
  }
}

export default async function AssessmentLayout({ children, params }: AssessmentLayoutProps) {
  const user = await currentUser()

  if (!user) {
    redirect(
      `/sign-in?redirect_url=/org/${params.orgId}/dashboard/client/vehicles/${params.vehicleId}/assessments/${params.assessmentId}`,
    )
  }

  return (
    <ConvexClientProvider>
      <div className="flex flex-col min-h-screen">{children}</div>
    </ConvexClientProvider>
  )
}
