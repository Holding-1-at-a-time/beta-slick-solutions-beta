"use client"

import { useConvexAuth } from "convex/react"
import { useUser, useOrganization } from "@clerk/nextjs"
import { useMemo } from "react"

export function useAuthInfo() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { user, isLoaded: isUserLoaded } = useUser()
  const { organization, membership, isLoaded: isOrgLoaded } = useOrganization()

  const authInfo = useMemo(() => {
    if (!isAuthenticated || !user || !organization) {
      return null
    }

    return {
      userId: user.id,
      orgId: organization.id,
      orgRole: membership?.role,
      orgPermissions: membership?.permissions || [],
      userType: (user.publicMetadata.user_type as string) || "client",
      businessSettings: (organization.publicMetadata.business_settings as Record<string, any>) || {},
      defaultVehicleId: user.publicMetadata.default_vehicle_id as string,
    }
  }, [isAuthenticated, user, organization, membership])

  return {
    authInfo,
    isLoading: isLoading || !isUserLoaded || !isOrgLoaded,
    isAuthenticated,
    user,
    organization,
    membership,
  }
}
