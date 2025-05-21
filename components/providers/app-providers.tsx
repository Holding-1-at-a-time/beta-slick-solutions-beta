"use client"

import type { ReactNode } from "react"
import { ConvexClientProvider } from "@/components/ConvexClientProvider"
import { AuthProvider } from "./auth-provider"
import { TenantProvider } from "./tenant-provider"
import { LayoutProvider } from "@/components/layouts/layout-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

interface AppProvidersProps {
  children: ReactNode
  tenantId?: string
  requireAuth?: boolean
  requireTenant?: boolean
  layoutType?: "default" | "dashboard" | "admin" | "client" | "member" | "marketing" | "minimal"
}

export function AppProviders({
  children,
  tenantId,
  requireAuth = false,
  requireTenant = false,
  layoutType = "default",
}: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ConvexClientProvider>
        <AuthProvider fallback={requireAuth ? <AuthRedirect /> : null}>
          <TenantProvider tenantId={tenantId} fallback={requireTenant ? <TenantRedirect /> : null}>
            <LayoutProvider initialLayoutType={layoutType}>
              {children}
              <Toaster />
            </LayoutProvider>
          </TenantProvider>
        </AuthProvider>
      </ConvexClientProvider>
    </ThemeProvider>
  )
}

function AuthRedirect() {
  // In a real implementation, this would redirect to the sign-in page
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-lg">Please sign in to access this page</p>
    </div>
  )
}

function TenantRedirect() {
  // In a real implementation, this would redirect to the organization selection page
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-lg">Please select an organization to access this page</p>
    </div>
  )
}
