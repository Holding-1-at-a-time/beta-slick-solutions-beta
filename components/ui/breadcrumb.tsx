"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

interface BreadcrumbProps {
  homeHref?: string
  className?: string
}

export default function Breadcrumb({ homeHref = "/", className }: BreadcrumbProps) {
  const pathname = usePathname()

  // Skip the first empty string after splitting
  const pathSegments = pathname.split("/").filter(Boolean)

  // Extract orgId if it exists
  const orgId = pathSegments.length > 0 ? pathSegments[0] : null

  // Create breadcrumb items
  const breadcrumbItems = pathSegments
    .map((segment, index) => {
      // Skip orgId in the breadcrumb display
      if (index === 0 && segment === orgId) {
        return null
      }

      // Build the href for this breadcrumb item
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`

      // Format the segment for display
      const displayName = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return {
        href,
        label: displayName,
      }
    })
    .filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link href={homeHref} className="text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <Fragment key={item?.href}>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li>
              {index === breadcrumbItems.length - 1 ? (
                <span className="font-medium text-foreground">{item?.label}</span>
              ) : (
                <Link href={item?.href || "#"} className="text-muted-foreground hover:text-foreground">
                  {item?.label}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
