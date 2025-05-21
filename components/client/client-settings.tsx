"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "@/components/ui/use-toast"
import { User, Settings, Palette } from "lucide-react"

interface ClientSettingsProps {
  orgId: string
}

export function ClientSettings({ orgId }: ClientSettingsProps) {
  const { user, isLoaded: isUserLoaded } = useUser()
  const userId = user?.id || ""

  const settings = useQuery(api.clientSettings.getClientSettings, {
    orgId,
    userId,
  })

  const updateBranding = useMutation(api.clientSettings.updateClientBranding)

  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })

  const [brandingData, setBrandingData] = useState({
    primaryColor: "#00AE98",
    secondaryColor: "#707070",
    darkMode: false,
  })

  // Update form data when settings are loaded
  useState(() => {
    if (settings?.user) {
      setFormData({
        firstName: settings.user.firstName || "",
        lastName: settings.user.lastName || "",
        phone: settings.user.phone || "",
      })
    }

    if (settings?.tenant?.branding) {
      setBrandingData({
        primaryColor: settings.tenant.branding.primaryColor || "#00AE98",
        secondaryColor: settings.tenant.branding.secondaryColor || "#707070",
        darkMode: settings.tenant.branding.darkMode || false,
      })
    }
  })

  const handleProfileUpdate = async () => {
    if (!user) return

    setIsUpdating(true)
    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phone: formData.phone,
        },
      })
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleBrandingUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateBranding({
        orgId,
        userId,
        branding: brandingData,
      })
      toast({
        title: "Branding updated",
        description: "Your branding preferences have been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating branding:", error)
      toast({
        title: "Error",
        description: "Failed to update branding preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isUserLoaded || !settings) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Account Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="flex items-center gap-2"
            disabled={!settings?.tenant?.allowClientBrandingCustomization}
          >
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={settings.user.email} disabled />
                <p className="text-xs text-gray-500">Email cannot be changed here. Please contact support.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                {isUpdating ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding Preferences
              </CardTitle>
              <CardDescription>Customize the appearance of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={brandingData.primaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={brandingData.secondaryColor}
                      onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="darkMode"
                  checked={brandingData.darkMode}
                  onCheckedChange={(checked) => setBrandingData({ ...brandingData, darkMode: checked })}
                />
                <Label htmlFor="darkMode">Enable Dark Mode</Label>
              </div>

              <div className="pt-4">
                <div className="text-sm font-medium mb-2">Preview</div>
                <div
                  className="h-20 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: brandingData.primaryColor }}
                >
                  <div
                    className="px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: brandingData.secondaryColor }}
                  >
                    Button Preview
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleBrandingUpdate} disabled={isUpdating}>
                {isUpdating ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
