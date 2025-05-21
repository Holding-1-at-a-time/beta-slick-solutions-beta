"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "convex/react"
import { query, mutation } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorAlert } from "@/components/ui/error-alert"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCw } from "lucide-react"

interface UpdateBrandingProps {
  onError?: (error: Error) => void
}

export function UpdateBranding({ onError }: UpdateBrandingProps) {
  const { toast } = useToast()
  const [queryError, setQueryError] = useState<Error | null>(null)
  const [mutationError, setMutationError] = useState<Error | null>(null)
  const tenant =
    useQuery(query("getTenantSettings"), {
      onError: (error) => {
        console.error("Failed to fetch tenant settings:", error)
        setQueryError(error)
        if (onError) onError(error)
      },
    }) || null

  const [logoUrl, setLogoUrl] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#00AE98")
  const [secondaryColor, setSecondaryColor] = useState("#707070")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const queryClient = useQueryClient()
  const updateBranding = useMutation(mutation("updateBranding"))

  useEffect(() => {
    if (tenant) {
      setLogoUrl(tenant.imageUrl || "")
      setPrimaryColor(tenant.branding?.primaryColor || "#00AE98")
      setSecondaryColor(tenant.branding?.secondaryColor || "#707070")
    }
  }, [tenant])

  const handleSave = async () => {
    setIsSubmitting(true)
    setMutationError(null)

    try {
      await updateBranding({
        logoUrl,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
        },
      })

      queryClient.invalidateQueries(["getTenantSettings"])

      toast({
        title: "Branding updated",
        description: "Your branding settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to update branding:", error)
      const typedError = error instanceof Error ? error : new Error("Failed to update branding")
      setMutationError(typedError)
      if (onError) onError(typedError)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (queryError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update Branding</CardTitle>
          <CardDescription>Customize your organization's visual identity</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorAlert title="Failed to load branding settings" error={queryError} />
          <Button onClick={() => queryClient.invalidateQueries(["getTenantSettings"])} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!tenant) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Update Branding</CardTitle>
          <CardDescription>Customize your organization's visual identity</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Branding</CardTitle>
        <CardDescription>Customize your organization's visual identity</CardDescription>
      </CardHeader>
      <CardContent>
        {mutationError && <ErrorAlert title="Failed to update branding" error={mutationError} className="mb-4" />}

        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-sm font-medium mb-1 block">Logo URL</label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            {logoUrl && (
              <div className="mt-2 p-4 border rounded flex justify-center">
                <img
                  src={logoUrl || "/placeholder.svg"}
                  alt="Logo Preview"
                  className="max-h-20 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                    e.currentTarget.alt = "Failed to load image"
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Primary Color</label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#00AE98" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Secondary Color</label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#707070"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Branding"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
