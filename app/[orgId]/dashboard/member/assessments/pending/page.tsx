import { PendingAssessments } from "@/components/member/pending-assessments"

export default function PendingAssessmentsPage({
  params,
}: {
  params: { orgId: string }
}) {
  return <PendingAssessments orgId={params.orgId} />
}
