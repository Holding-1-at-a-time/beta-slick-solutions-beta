import { VehicleDetail } from "@/components/vehicles/vehicle-detail"

export default function VehicleDetailPage({ params }: { params: { orgId: string; vehicleId: string } }) {
  return <VehicleDetail orgId={params.orgId} vehicleId={params.vehicleId} />
}
