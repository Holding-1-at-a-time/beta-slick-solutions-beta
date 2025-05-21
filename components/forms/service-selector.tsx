"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Minus, X } from "lucide-react"
import type { ServiceItem, ServiceSelection } from "./assessment-form"

interface ServiceSelectorProps {
  services: ServiceItem[]
  selectedServices: ServiceSelection[]
  assessmentId?: string
  onSelect: (services: ServiceSelection[]) => void
}

export default function ServiceSelector({ services, selectedServices, assessmentId, onSelect }: ServiceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [selections, setSelections] = useState<ServiceSelection[]>(selectedServices || [])

  // Extract unique categories from services
  const categories = ["all", ...Array.from(new Set(services.map((service) => service.category)))]

  // Filter services based on search term and active category
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || service.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // Calculate total estimated cost and time
  const totalCost = selections.reduce((sum, selection) => {
    const service = services.find((s) => s.id === selection.serviceId)
    return sum + (service ? service.price * selection.quantity : 0)
  }, 0)

  const totalTime = selections.reduce((sum, selection) => {
    const service = services.find((s) => s.id === selection.serviceId)
    return sum + (service ? service.estimatedTime * selection.quantity : 0)
  }, 0)

  // Format time in hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleAddService = (service: ServiceItem) => {
    const existingIndex = selections.findIndex((s) => s.serviceId === service.id)

    if (existingIndex >= 0) {
      // Increment quantity if already selected
      const updated = [...selections]
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      }
      setSelections(updated)
    } else {
      // Add new service
      setSelections([
        ...selections,
        {
          serviceId: service.id,
          quantity: 1,
          notes: "",
        },
      ])
    }
  }

  const handleRemoveService = (serviceId: string) => {
    setSelections(selections.filter((s) => s.serviceId !== serviceId))
  }

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    const updated = selections.map((s) => (s.serviceId === serviceId ? { ...s, quantity: Math.max(1, quantity) } : s))
    setSelections(updated)
  }

  const handleNotesChange = (serviceId: string, notes: string) => {
    const updated = selections.map((s) => (s.serviceId === serviceId ? { ...s, notes } : s))
    setSelections(updated)
  }

  // Update parent component when selections change
  useEffect(() => {
    onSelect(selections)
  }, [selections, onSelect])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
          <TabsList className="w-full overflow-x-auto flex flex-nowrap">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Services</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredServices.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No services found matching your criteria</p>
            ) : (
              filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium">{service.name}</h4>
                          <Badge variant="outline" className="ml-2 capitalize">
                            {service.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="font-medium">{formatCurrency(service.price)}</span>
                          <span className="mx-2">•</span>
                          <span>{formatTime(service.estimatedTime)}</span>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAddService(service)} className="ml-2 h-9 w-9">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Selected Services</h3>
            <div className="text-sm">
              <div className="font-medium">{formatCurrency(totalCost)}</div>
              <div className="text-gray-500">{formatTime(totalTime)}</div>
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {selections.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No services selected yet</p>
            ) : (
              selections.map((selection) => {
                const service = services.find((s) => s.id === selection.serviceId)
                if (!service) return null

                return (
                  <Card key={service.id} className="overflow-hidden">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{service.name}</h4>
                          <div className="flex items-center mt-2 text-sm">
                            <span className="font-medium">{formatCurrency(service.price * selection.quantity)}</span>
                            <span className="mx-2">•</span>
                            <span>{formatTime(service.estimatedTime * selection.quantity)}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveService(service.id)}
                          className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-3 flex items-center">
                        <Label className="mr-2">Quantity:</Label>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(service.id, selection.quantity - 1)}
                            disabled={selection.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 w-6 text-center">{selection.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(service.id, selection.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Label htmlFor={`notes-${service.id}`} className="mb-1 block">
                          Notes:
                        </Label>
                        <Textarea
                          id={`notes-${service.id}`}
                          placeholder="Add special instructions or notes"
                          value={selection.notes}
                          onChange={(e) => handleNotesChange(service.id, e.target.value)}
                          rows={2}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
