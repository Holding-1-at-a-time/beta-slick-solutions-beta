"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils/format-date"

export function PendingAssessments({
  orgId,
  summary = false,
}: {
  orgId: string
  summary?: boolean
}) {
  const { user } = useUser()
  const userId = user?.id || ""

  const assessments = useQuery(query("listPendingAssessments"), orgId, userId) || []
  const list = summary ? assessments.slice(0, 3) : assessments

  if (!assessments && !summary) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border p-4 rounded-md">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (assessments?.length === 0) {
    return <p className="text-muted-foreground">No pending assessments.</p>
  }

  return (
    <ul className="space-y-2">
      {list.map((assessment) => (
        <li key={assessment._id} className="border p-3 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium">{assessment.customerName}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(assessment.createdAt)} • {assessment.vehicleMake} {assessment.vehicleModel}
            </p>
          </div>
          <Button asChild size="sm">
            <Link href={`/${orgId}/dashboard/member/assessments/review/${assessment._id}`}>Review</Link>
          </Button>
        </li>
      ))}

      {summary && assessments.length > 3 && (
        <li className="text-center pt-2">
          <Button variant="link" asChild>
            <Link href={`/${orgId}/dashboard/member/assessments/pending`}>
              View all {assessments.length} pending assessments
            </Link>
          </Button>
        </li>
      )}
    </ul>
  )
}
