"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface UpdateBrandingProps {
  tenant?: any
  onError?: (error: Error) => void
}

export function UpdateBranding({ tenant, onError }: UpdateBrandingProps) {
  const { toast } = useToast()
  const updateBranding = useMutation(api.admin.updateBranding)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    logoUrl: tenant?.imageUrl || "",
    colors: {
      primary: tenant?.branding?.primaryColor || "#00AE98",
      secondary: tenant?.branding?.secondaryColor || "#707070",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      await updateBranding(formData)
      toast({
        title: "Branding updated",
        description: "Your branding settings have been updated successfully.",
      })
    } catch (error) {
      const err = error as Error
      setFormError(err.message)
      if (onError) {
        onError(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Settings</CardTitle>
        <CardDescription>Customize your organization's branding and appearance.</CardDescription>
      </CardHeader>

      {formError && (
        <CardContent className="pt-0">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        </CardContent>
      )}

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={formData.colors.primary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: {
                      ...formData.colors,
                      primary: e.target.value,
                    },
                  })
                }
                className="w-12 h-10 p-1"
                disabled={isSubmitting}
              />
              <Input
                value={formData.colors.primary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: {
                      ...formData.colors,
                      primary: e.target.value,
                    },
                  })
                }
                className="flex-1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={formData.colors.secondary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: {
                      ...formData.colors,
                      secondary: e.target.value,
                    },
                  })
                }
                className="w-12 h-10 p-1"
                disabled={isSubmitting}
              />
              <Input
                value={formData.colors.secondary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: {
                      ...formData.colors,
                      secondary: e.target.value,
                    },
                  })
                }
                className="flex-1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="pt-4">
            <div
              className="p-4 border rounded-md"
              style={{
                backgroundColor: formData.colors.primary,
                color: "#ffffff",
              }}
            >
              <h3 className="text-lg font-bold mb-2">Primary Color Preview</h3>
              <p>This is how your primary color will look.</p>
            </div>
          </div>

          <div className="pt-2">
            <div
              className="p-4 border rounded-md"
              style={{
                backgroundColor: formData.colors.secondary,
                color: "#ffffff",
              }}
            >
              <h3 className="text-lg font-bold mb-2">Secondary Color Preview</h3>
              <p>This is how your secondary color will look.</p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Branding"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
