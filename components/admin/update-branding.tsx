"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "convex/react"
import { query, mutation } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

interface UpdateBrandingProps {
  onError?: (message: string) => void
}

export function UpdateBranding({ onError }: UpdateBrandingProps) {
  const {
    results: tenant,
    isLoading,
    isError,
    error,
  } = useQuery(query("getTenantSettings")) || {
    results: null,
    isLoading: true,
    isError: false,
  }

  const [logoUrl, setLogoUrl] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#00AE98")
  const [secondaryColor, setSecondaryColor] = useState("#707070")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const queryClient = useQueryClient()
  const updateBranding = useMutation(mutation("updateBranding"))

  useEffect(() => {
    if (tenant) {
      setLogoUrl(tenant.imageUrl || "")
      setPrimaryColor(tenant.branding?.primaryColor || "#00AE98")
      setSecondaryColor(tenant.branding?.secondaryColor || "#707070")
    }
  }, [tenant])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setLocalError(null)
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setLocalError(null)

    try {
      await updateBranding({
        logoUrl,
        colors: {
          primary: primaryColor,
          secondary: secondaryColor,
        },
      })

      queryClient.invalidateQueries(["getTenantSettings"])
    } catch (error) {
      console.error("Failed to update branding:", error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while updating branding"

      setLocalError(errorMessage)
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load tenant settings: {error?.message || "Unknown error"}
          <div className="mt-4">
            <Button onClick={handleRetry} size="sm" variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Branding</CardTitle>
        <CardDescription>Customize your organization's visual identity</CardDescription>
      </CardHeader>
      <CardContent>
        {localError && !onError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

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
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                    setLocalError("Failed to load logo image. Please check the URL.")
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
