import { AssessmentLayout } from "@/components/assessments/assessment-layout"
import { AssessmentReview } from "@/components/assessments/assessment-review"

interface AssessmentReviewPageProps {
  params: {
    orgId: string
    vehicleId: string
    assessmentId: string
  }
}

export default function AssessmentReviewPage({ params }: AssessmentReviewPageProps) {
  return (
    <AssessmentLayout>
      <AssessmentReview orgId={params.orgId} vehicleId={params.vehicleId} assessmentId={params.assessmentId} />
    </AssessmentLayout>
  )
}
