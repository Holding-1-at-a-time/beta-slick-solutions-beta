import { PendingAssessments } from "@/components/member"
import { Card } from "@/components/ui/card"

export default function PendingAssessmentsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Pending Assessments</h1>
      <Card className="p-6">
        <PendingAssessments />
      </Card>
    </div>
  )
}
