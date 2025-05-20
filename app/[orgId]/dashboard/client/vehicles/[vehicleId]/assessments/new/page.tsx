import { NewAssessment } from "@/components/vehicles/new-assessment"

export default function NewAssessmentPage({ params }: { params: { orgId: string; vehicleId: string } }) {
  return <NewAssessment orgId={params.orgId} vehicleId={params.vehicleId} />
}
