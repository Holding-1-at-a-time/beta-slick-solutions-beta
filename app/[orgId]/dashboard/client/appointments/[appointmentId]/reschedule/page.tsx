import { Suspense } from "react"
import { TimeSelection } from "@/components/appointments/time-selection"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { getAppointmentDetail } from "@/app/actions/appointments"
import { auth } from "@clerk/nextjs/server"

interface ReschedulePageProps {
  params: {
    orgId: string
    appointmentId: string
  }
}

export default async function ReschedulePage({ params }: ReschedulePageProps) {
  const { userId } = auth()

  if (!userId) {
    return <div>Unauthorized: You must be signed in to view this page.</div>
  }

  const appointment = await getAppointmentDetail(params.orgId, params.appointmentId)

  return (
    <div className="container py-6">
      <Suspense fallback={<LoadingPlaceholder message="Loading scheduling options..." />}>
        <TimeSelection
          orgId={params.orgId}
          appointmentId={params.appointmentId}
          serviceDuration={appointment.duration}
        />
      </Suspense>
    </div>
  )
}
