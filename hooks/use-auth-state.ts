"use client"

import { useAuth, useUser, useOrganization, useOrganizationList } from "@clerk/nextjs"

export function useAuthState() {
  const { isLoaded: isAuthLoaded, userId, sessionId, getToken } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()
  const { organization, isLoaded: isOrgLoaded } = useOrganization()
  const { organizationList, isLoaded: isOrgListLoaded } = useOrganizationList()

  const isLoaded = isAuthLoaded && isUserLoaded && isOrgLoaded && isOrgListLoaded

  return {
    isLoaded,
    isSignedIn: !!userId,
    userId,
    sessionId,
    user,
    organization,
    organizationList,
    getToken,
  }
}
