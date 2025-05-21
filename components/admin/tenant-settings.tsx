"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UpdateBranding } from "./update-branding"
import { ConfigureRules } from "./configure-rules"

export function TenantSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tenant Settings</h2>

      <Tabs defaultValue="branding">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="rules">Business Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="pt-6">
          <UpdateBranding />
        </TabsContent>

        <TabsContent value="rules" className="pt-6">
          <ConfigureRules />
        </TabsContent>
      </Tabs>
    </div>
  )
}
