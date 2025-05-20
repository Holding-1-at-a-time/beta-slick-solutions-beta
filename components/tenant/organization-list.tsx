"use client"

import { useOrganizationList, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Plus, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrganizationList() {
  const { organizationList, isLoaded, setActive } = useOrganizationList()
  const { user } = useUser()
  const router = useRouter()

  const handleCreateOrg = () => {
    router.push("/create-organization")
  }

  const handleSelectOrg = async (orgId: string) => {
    try {
      await setActive({ organization: orgId })
      router.push(`/org/${orgId}/dashboard`)
    } catch (error) {
      console.error("Error switching organization:", error)
    }
  }

  if (!isLoaded) {
    return (
      <div className="space-y-4 w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Organizations</h2>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Organizations</h2>
        <Button onClick={handleCreateOrg}>
          <Plus className="mr-2 h-4 w-4" /> Create Organization
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizationList.items.map((org) => (
          <Card key={org.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                {org.imageUrl ? (
                  <img
                    src={org.imageUrl || "/placeholder.svg"}
                    alt={org.name}
                    className="h-8 w-8 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-lg font-bold text-primary">
                    {org.name.charAt(0)}
                  </div>
                )}
                <span className="truncate">{org.name}</span>
              </CardTitle>
              <CardDescription>
                {org.membersCount} member{org.membersCount !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">{org.membership?.role || "Member"}</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={() => handleSelectOrg(org.id)}>
                Select <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center p-6 text-center border-dashed">
          <Building className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Create a new organization</h3>
          <p className="text-sm text-muted-foreground mb-4">Start a new organization for your team or business</p>
          <Button onClick={handleCreateOrg}>
            <Plus className="mr-2 h-4 w-4" /> Create Organization
          </Button>
        </Card>
      </div>
    </div>
  )
}
