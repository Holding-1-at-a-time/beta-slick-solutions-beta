import { AddVehicle } from "@/components/vehicles/add-vehicle"

export default function AddVehiclePage({ params }: { params: { orgId: string } }) {
  return <AddVehicle orgId={params.orgId} />
}
