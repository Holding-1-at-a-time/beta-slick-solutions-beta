import { ReviewAssessment } from "@/components/member"
import type { Id } from "@/convex/_generated/dataModel"

export default function ReviewAssessmentPage({
  params,
}: {
  params: { assessmentId: string }
}) {
  return (
    <div className="p-6">
      <ReviewAssessment assessmentId={params.assessmentId as Id<"assessments">} />
    </div>
  )
}
