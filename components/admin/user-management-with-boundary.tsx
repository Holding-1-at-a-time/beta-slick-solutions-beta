"use client"

import { UserManagement } from "./user-management"
import { withErrorBoundary } from "@/components/with-error-boundary"

export const UserManagementWithBoundary = withErrorBoundary(UserManagement, {
  componentName: "UserManagement",
  showHomeButton: true,
  homeHref: "/dashboard/admin",
})
