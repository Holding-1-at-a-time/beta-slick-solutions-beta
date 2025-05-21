"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { getPricingParams, updatePricingParams } from "@/app/actions/pricing"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"

interface PricingSettingsProps {
  orgId: string
}

export function PricingSettings({ orgId }: PricingSettingsProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("base-prices")

  useEffect(() => {
    async function fetchSettings() {
      try {
        const params = await getPricingParams()
        setSettings(params)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching pricing parameters:", error)
        toast({
          title: "Error",
          description: "Failed to load pricing settings. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleBasePriceChange = (service: string, value: number) => {
    setSettings({
      ...settings,
      tenantBasePrice: {
        ...settings.tenantBasePrice,
        [service]: value,
      },
    })
  }

  const handleUrgencyMultiplierChange = (urgency: string, value: number) => {
    setSettings({
      ...settings,
      urgencyMultipliers: {
        ...settings.urgencyMultipliers,
        [urgency]: value,
      },
    })
  }

  const handleDiscountToggle = (discount: string, enabled: boolean) => {
    setSettings({
      ...settings,
      discountRules: {
        ...settings.discountRules,
        [discount]: {
          ...settings.discountRules[discount],
          enabled,
        },
      },
    })
  }

  const handleDiscountValueChange = (discount: string, field: string, value: number) => {
    setSettings({
      ...settings,
      discountRules: {
        ...settings.discountRules,
        [discount]: {
          ...settings.discountRules[discount],
          [field]: value,
        },
      },
    })
  }

  const handleLaborRateChange = (value: number) => {
    setSettings({
      ...settings,
      laborRate: value,
    })
  }

  const handleMarkupChange = (value: number) => {
    setSettings({
      ...settings,
      markup: value,
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updatePricingParams(settings)
      toast({
        title: "Settings saved",
        description: "Your pricing settings have been updated successfully.",
      })
      setSaving(false)
    } catch (error) {
      console.error("Error saving pricing settings:", error)
      toast({
        title: "Error",
        description: "Failed to save pricing settings. Please try again.",
        variant: "destructive",
      })
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Settings</CardTitle>
          <CardDescription>Loading pricing settings...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingPlaceholder />
        </CardContent>
      </Card>
    )
  }

  if (!settings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Settings</CardTitle>
          <CardDescription>Error loading settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Failed to load pricing settings. Please try again.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Settings</CardTitle>
        <CardDescription>Customize your dynamic pricing parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="base-prices">Base Prices</TabsTrigger>
            <TabsTrigger value="urgency">Urgency</TabsTrigger>
            <TabsTrigger value="discounts">Discounts</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="base-prices" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Base Service Prices</h3>
              <p className="text-sm text-gray-500">Set the base price for each service type.</p>

              {Object.entries(settings.tenantBasePrice).map(([service, price]) => (
                <div key={service} className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`base-price-${service}`} className="capitalize">
                      {service.replace(/_/g, " ")}
                    </Label>
                    <span className="font-medium">${(price as number).toFixed(2)}</span>
                  </div>
                  <Slider
                    id={`base-price-${service}`}
                    min={0}
                    max={1000}
                    step={5}
                    value={[price as number]}
                    onValueChange={(value) => handleBasePriceChange(service, value[0])}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="urgency" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Urgency Multipliers</h3>
              <p className="text-sm text-gray-500">
                Set price multipliers for different urgency levels. A multiplier of 1.0 means no change to the base
                price.
              </p>

              {Object.entries(settings.urgencyMultipliers).map(([urgency, multiplier]) => (
                <div key={urgency} className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`urgency-${urgency}`} className="capitalize">
                      {urgency}
                    </Label>
                    <span className="font-medium">{(multiplier as number).toFixed(2)}×</span>
                  </div>
                  <Slider
                    id={`urgency-${urgency}`}
                    min={1}
                    max={3}
                    step={0.05}
                    value={[multiplier as number]}
                    onValueChange={(value) => handleUrgencyMultiplierChange(urgency, value[0])}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="discounts" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Discount Rules</h3>
              <p className="text-sm text-gray-500">Configure automatic discount rules for your services.</p>

              {Object.entries(settings.discountRules).map(([discount, rule]) => (
                <div key={discount} className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`discount-${discount}`} className="capitalize font-medium">
                      {discount} Discount
                    </Label>
                    <Switch
                      id={`discount-${discount}`}
                      checked={(rule as any).enabled}
                      onCheckedChange={(checked) => handleDiscountToggle(discount, checked)}
                    />
                  </div>

                  {(rule as any).enabled && (
                    <div className="space-y-4 pt-2">
                      {discount === "loyalty" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={`loyalty-threshold`}>Minimum Services</Label>
                            <span>{(rule as any).threshold} services</span>
                          </div>
                          <Slider
                            id={`loyalty-threshold`}
                            min={1}
                            max={10}
                            step={1}
                            value={[(rule as any).threshold]}
                            onValueChange={(value) => handleDiscountValueChange(discount, "threshold", value[0])}
                          />
                        </div>
                      )}

                      {discount === "seasonal" && (
                        <div className="space-y-2">
                          <Label>Applicable Months</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
                              (month, index) => (
                                <div
                                  key={month}
                                  className={`text-center p-2 rounded-md cursor-pointer border ${
                                    (rule as any).months.includes(index + 1)
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-background"
                                  }`}
                                  onClick={() => {
                                    const months = [...(rule as any).months]
                                    const monthIndex = index + 1
                                    if (months.includes(monthIndex)) {
                                      const newMonths = months.filter((m) => m !== monthIndex)
                                      handleDiscountValueChange(discount, "months", newMonths)
                                    } else {
                                      months.push(monthIndex)
                                      handleDiscountValueChange(discount, "months", months)
                                    }
                                  }}
                                >
                                  {month}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {discount === "bundle" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor={`bundle-threshold`}>Minimum Services</Label>
                            <span>{(rule as any).threshold} services</span>
                          </div>
                          <Slider
                            id={`bundle-threshold`}
                            min={2}
                            max={5}
                            step={1}
                            value={[(rule as any).threshold]}
                            onValueChange={(value) => handleDiscountValueChange(discount, "threshold", value[0])}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor={`${discount}-percentage`}>Discount Percentage</Label>
                          <span>{(rule as any).discountPercentage}%</span>
                        </div>
                        <Slider
                          id={`${discount}-percentage`}
                          min={5}
                          max={50}
                          step={5}
                          value={[(rule as any).discountPercentage]}
                          onValueChange={(value) => handleDiscountValueChange(discount, "discountPercentage", value[0])}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Labor Rate</h3>
              <p className="text-sm text-gray-500">Set your hourly labor rate.</p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="labor-rate">Hourly Rate</Label>
                  <span className="font-medium">${settings.laborRate.toFixed(2)}/hour</span>
                </div>
                <Slider
                  id="labor-rate"
                  min={50}
                  max={250}
                  step={5}
                  value={[settings.laborRate]}
                  onValueChange={(value) => handleLaborRateChange(value[0])}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Parts Markup</h3>
              <p className="text-sm text-gray-500">Set your parts markup multiplier.</p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="markup">Markup Multiplier</Label>
                  <span className="font-medium">
                    {settings.markup.toFixed(2)}× ({((settings.markup - 1) * 100).toFixed(0)}%)
                  </span>
                </div>
                <Slider
                  id="markup"
                  min={1}
                  max={2}
                  step={0.05}
                  value={[settings.markup]}
                  onValueChange={(value) => handleMarkupChange(value[0])}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  )
}
