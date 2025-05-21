"use client"

import { TenantSettings } from "./tenant-settings"
import { withErrorBoundary } from "@/components/with-error-boundary"

export const TenantSettingsWithBoundary = withErrorBoundary(TenantSettings, {
  componentName: "TenantSettings",
  showHomeButton: true,
  homeHref: "/dashboard/admin",
})
