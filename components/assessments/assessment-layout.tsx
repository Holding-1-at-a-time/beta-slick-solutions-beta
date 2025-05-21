"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

interface AssessmentLayoutProps {
  children: React.ReactNode
}

export function AssessmentLayout({ children }: AssessmentLayoutProps) {
  const params = useParams<{
    orgId: string
    vehicleId: string
    assessmentId: string
  }>()

  const assessmentDetails = useQuery(api.assessmentDetails.getAssessmentDetails, {
    orgId: params.orgId,
    assessmentId: params.assessmentId as Id<"assessments">,
  })

  const vehicleDetails = assessmentDetails?.vehicle

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href={`/org/${params.orgId}/dashboard/client`}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link
                href={`/org/${params.orgId}/dashboard/client/vehicles`}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
              >
                Vehicles
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link
                href={`/org/${params.orgId}/dashboard/client/vehicles/${params.vehicleId}`}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
              >
                {vehicleDetails ? `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}` : "Vehicle"}
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                Assessment {params.assessmentId.substring(0, 8)}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {children}
    </div>
  )
}
