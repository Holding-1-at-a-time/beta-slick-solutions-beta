"use client"

import { usePendingAssessments } from "@/hooks/useMember"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { formatDate } from "@/lib/utils/format-date"

export default function PendingAssessments({ summary = false }: { summary?: boolean }) {
  const { assessments, isLoading } = usePendingAssessments()
  const list = summary ? assessments.slice(0, 3) : assessments

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(summary ? 3 : 5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (list.length === 0) {
    return <p className="text-gray-500 text-sm">No pending assessments.</p>
  }

  return (
    <ul className="space-y-2">
      {list.map((assessment) => (
        <li key={assessment._id}>
          <Link
            href={`./member/assessments/review/${assessment._id}`}
            className="block hover:bg-gray-50 rounded p-2 transition-colors"
          >
            <p className="font-medium">{assessment.vehicleName || "Vehicle Assessment"}</p>
            <p className="text-sm text-gray-600">{formatDate(assessment.createdAt)}</p>
          </Link>
        </li>
      ))}
      {summary && assessments.length > 3 && (
        <li className="text-center">
          <Link href="./member/assessments/pending" className="text-blue-600 hover:underline text-sm">
            View all {assessments.length} pending assessments
          </Link>
        </li>
      )}
    </ul>
  )
}
