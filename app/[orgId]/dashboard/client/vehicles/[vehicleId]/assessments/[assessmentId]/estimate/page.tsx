import { AssessmentLayout } from "@/components/assessments/assessment-layout"
import { EstimateView } from "@/components/assessments/estimate-view"

interface EstimateViewPageProps {
  params: {
    orgId: string
    vehicleId: string
    assessmentId: string
  }
}

export default function EstimateViewPage({ params }: EstimateViewPageProps) {
  return (
    <AssessmentLayout>
      <EstimateView orgId={params.orgId} vehicleId={params.vehicleId} assessmentId={params.assessmentId} />
    </AssessmentLayout>
  )
}
