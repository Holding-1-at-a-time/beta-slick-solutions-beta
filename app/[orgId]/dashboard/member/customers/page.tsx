import { CustomerList } from "@/components/member"
import { Card } from "@/components/ui/card"

export default function CustomersPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>
      <Card className="p-6">
        <CustomerList />
      </Card>
    </div>
  )
}
