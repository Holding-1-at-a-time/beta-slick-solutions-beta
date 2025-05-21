"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpdateBranding } from "./update-branding"
import { ConfigureRules } from "./configure-rules"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import * as Sentry from "@sentry/nextjs"

export function TenantSettings() {
  const [error, setError] = useState<Error | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [activeTab, setActiveTab] = useState("branding")

  const tenantSettings = useQuery(api.admin.getTenantSettings, {
    onError: (err) => {
      Sentry.captureException(err, {
        extra: {
          component: "TenantSettings",
          action: "getTenantSettings query",
        },
      })
      setError(err)
    },
  })

  const isLoading = tenantSettings === undefined && !error

  const handleRetry = () => {
    setIsRetrying(true)
    setError(null)
    // Force a refetch by invalidating the query cache
    setTimeout(() => {
      setIsRetrying(false)
    }, 1000)
  }

  const handleError = (err: Error, context: string) => {
    Sentry.captureException(err, {
      extra: {
        component: "TenantSettings",
        action: context,
      },
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tenant Settings</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load tenant settings: {error.message}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={handleRetry} disabled={isRetrying}>
                {isRetrying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry
                  </>
                )}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading || isRetrying) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tenant Settings</h2>
        <div className="border rounded-md p-4">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tenant Settings</h2>

      <Tabs defaultValue="branding" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="rules">Business Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="pt-6">
          <UpdateBranding tenant={tenantSettings} onError={(err) => handleError(err, "UpdateBranding")} />
        </TabsContent>

        <TabsContent value="rules" className="pt-6">
          <ConfigureRules tenant={tenantSettings} onError={(err) => handleError(err, "ConfigureRules")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
