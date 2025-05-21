import { ReviewAssessment } from "@/components/member/review-assessment"

export default function ReviewAssessmentPage({
  params,
}: {
  params: { orgId: string; assessmentId: string }
}) {
  return <ReviewAssessment orgId={params.orgId} assessmentId={params.assessmentId} />
}
