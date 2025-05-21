"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpdateBranding } from "./update-branding"
import { ConfigureRules } from "./configure-rules"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function TenantSettings() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("branding")
  const [error, setError] = useState<string | null>(null)

  const handleError = (message: string) => {
    setError(message)
    toast({
      variant: "destructive",
      title: "Error updating settings",
      description: message,
    })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setError(null) // Clear errors when changing tabs
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tenant Settings</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="branding" value={activeTab} onValueChange={handleTabChange}>
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
