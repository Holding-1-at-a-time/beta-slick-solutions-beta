import { AssessmentLayout } from "@/components/assessments/assessment-layout"
import { ReviseEstimate } from "@/components/assessments/revise-estimate"

interface ReviseEstimatePageProps {
  params: {
    orgId: string
    vehicleId: string
    assessmentId: string
  }
}

export default function ReviseEstimatePage({ params }: ReviseEstimatePageProps) {
  return (
    <AssessmentLayout>
      <ReviseEstimate orgId={params.orgId} vehicleId={params.vehicleId} assessmentId={params.assessmentId} />
    </AssessmentLayout>
  )
}
