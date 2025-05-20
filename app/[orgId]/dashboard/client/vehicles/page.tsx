import { VehicleList } from "@/components/vehicles/vehicle-list"

export default function VehiclesPage({ params }: { params: { orgId: string } }) {
  return <VehicleList orgId={params.orgId} />
}
