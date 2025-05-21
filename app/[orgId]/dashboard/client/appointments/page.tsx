import { Suspense } from "react"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { listAppointments } from "@/app/actions/appointments"
import { auth } from "@clerk/nextjs/server"

interface AppointmentsPageProps {
  params: {
    orgId: string
  }
}

export default async function AppointmentsPage({ params }: AppointmentsPageProps) {
  const { userId } = auth()

  if (!userId) {
    return <div>Unauthorized: You must be signed in to view this page.</div>
  }

  const appointments = await listAppointments(params.orgId)

  return (
    <div className="container py-6">
      <Suspense fallback={<LoadingPlaceholder message="Loading appointments..." />}>
        <AppointmentList initialAppointments={appointments} orgId={params.orgId} />
      </Suspense>
    </div>
  )
}
