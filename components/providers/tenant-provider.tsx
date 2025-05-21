"use client"

import { type ReactNode, createContext, useContext, useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface TenantContextType {
  tenantId: string | null
  tenantName: string | null
  tenantLogo: string | null
  tenantPrimaryColor: string | null
  tenantSecondaryColor: string | null
  isLoading: boolean
  isAdmin: boolean
  isMember: boolean
  isClient: boolean
  userRole: string | null
}

const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  tenantName: null,
  tenantLogo: null,
  tenantPrimaryColor: null,
  tenantSecondaryColor: null,
  isLoading: true,
  isAdmin: false,
  isMember: false,
  isClient: false,
  userRole: null,
})

export const useTenantContext = () => useContext(TenantContext)

interface TenantProviderProps {
  children: ReactNode
  tenantId?: string
  loadingComponent?: ReactNode
  fallback?: ReactNode
}

export function TenantProvider({
  children,
  tenantId: propTenantId,
  loadingComponent = <TenantLoadingState />,
  fallback = null,
}: TenantProviderProps) {
  const params = useParams()
  const routeTenantId = params?.orgId as string
  const effectiveTenantId = propTenantId || routeTenantId

  const tenant = useQuery(api.tenant.getTenantById, effectiveTenantId ? { id: effectiveTenantId } : "skip")

  const userRole = useQuery(api.roles.getUserRoleInTenant, effectiveTenantId ? { tenantId: effectiveTenantId } : "skip")

  const [tenantState, setTenantState] = useState<TenantContextType>({
    tenantId: null,
    tenantName: null,
    tenantLogo: null,
    tenantPrimaryColor: null,
    tenantSecondaryColor: null,
    isLoading: true,
    isAdmin: false,
    isMember: false,
    isClient: false,
    userRole: null,
  })

  useEffect(() => {
    if (!effectiveTenantId) {
      setTenantState((prev) => ({
        ...prev,
        isLoading: false,
      }))
      return
    }

    if (tenant !== undefined && userRole !== undefined) {
      setTenantState({
        tenantId: effectiveTenantId,
        tenantName: tenant?.name || null,
        tenantLogo: tenant?.logoUrl || null,
        tenantPrimaryColor: tenant?.primaryColor || "#00AE98",
        tenantSecondaryColor: tenant?.secondaryColor || "#707070",
        isLoading: false,
        isAdmin: userRole === "admin",
        isMember: userRole === "member",
        isClient: userRole === "client",
        userRole: userRole,
      })
    }
  }, [effectiveTenantId, tenant, userRole])

  if (tenantState.isLoading) {
    return <>{loadingComponent}</>
  }

  if (!tenantState.tenantId) {
    return <>{fallback}</>
  }

  return <TenantContext.Provider value={tenantState}>{children}</TenantContext.Provider>
}

function TenantLoadingState() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size="lg" />
      <span className="ml-2 text-lg">Loading organization...</span>
    </div>
  )
}
