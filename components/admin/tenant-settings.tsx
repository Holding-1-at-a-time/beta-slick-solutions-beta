"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpdateBranding } from "./update-branding"
import { ConfigureRules } from "./configure-rules"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function TenantSettings() {
  const [error, setError] = useState<Error | null>(null)

  const handleError = (error: Error) => {
    console.error("Tenant settings error:", error)
    setError(error)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tenant Settings</h2>

      {error && (
        <div className="mb-4">
          <ErrorAlert title="Settings Error" error={error} />
          <Button onClick={clearError} size="sm" variant="outline" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Dismiss
          </Button>
        </div>
      )}

      <Tabs defaultValue="branding">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="rules">Business Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="pt-6">
          <UpdateBranding onError={handleError} />
        </TabsContent>

        <TabsContent value="rules" className="pt-6">
          <ConfigureRules onError={handleError} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
