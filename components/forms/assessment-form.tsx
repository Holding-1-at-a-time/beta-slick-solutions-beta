"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MediaUploader from "./media-uploader"
import ServiceSelector from "./service-selector"
import { useRouter } from "next/navigation"

// Define the assessment form schema using Zod
const assessmentFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  mileage: z.coerce.number().min(0, "Mileage must be a positive number"),
  customerConcerns: z.string().optional(),
  technicianNotes: z.string().optional(),
})

export type AssessmentFormData = z.infer<typeof assessmentFormSchema>

// Define the ServiceItem type
export interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: number
  category: string
}

// Define the ServiceSelection type
export interface ServiceSelection {
  serviceId: string
  quantity: number
  notes: string
}

interface AssessmentFormProps {
  vehicleId: string
  tenantId: string
  onSubmit?: (data: AssessmentFormData, services: ServiceSelection[], mediaIds: string[]) => void
}

export default function AssessmentForm({ vehicleId, tenantId, onSubmit }: AssessmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([])
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([])

  const router = useRouter()

  // Fetch vehicle details
  const vehicle = useQuery(api.vehicles.getVehicleById, { id: vehicleId })

  // Fetch available services
  const services = useQuery(api.assessments.listAvailableServices, { tenantId }) || []

  // Mutations
  const createAssessment = useMutation(api.assessments.createAssessment)

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      mileage: 0,
      customerConcerns: "",
      technicianNotes: "",
    },
  })

  const handleSubmit = async (data: AssessmentFormData) => {
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        onSubmit(data, selectedServices, uploadedMediaIds)
      } else {
        // If no custom onSubmit is provided, use the default Convex mutation
        const result = await createAssessment({
          vehicleId,
          tenantId,
          ...data,
          serviceItems: selectedServices,
          mediaIds: uploadedMediaIds,
        })

        toast({
          title: "Assessment created",
          description: "Vehicle assessment has been created successfully.",
        })

        // Navigate to the assessment detail page
        if (result) {
          router.push(`/dashboard/client/vehicles/${vehicleId}/assessments/${result.id}`)
        }
      }
    } catch (error) {
      console.error("Error submitting assessment form:", error)
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleServiceSelection = (services: ServiceSelection[]) => {
    setSelectedServices(services)
  }

  const handleMediaUpload = (mediaId: string) => {
    setUploadedMediaIds((prev) => [...prev, mediaId])
  }

  // Show loading state while fetching vehicle data
  if (!vehicle) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Vehicle Assessment</CardTitle>
        <CardDescription>
          Create a new assessment for {vehicle.year} {vehicle.make} {vehicle.model}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6 w-full overflow-x-auto">
            <TabsTrigger value="details">Assessment Details</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Form {...form}>
              <form id="assessment-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Regular Maintenance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description of the assessment" {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Mileage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="45000"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormDescription>Current odometer reading in miles</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerConcerns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Concerns</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Customer reported issues or concerns" {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technicianNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technician Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Technical observations and notes" {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="services">
            <ServiceSelector
              services={services}
              selectedServices={selectedServices}
              onSelect={handleServiceSelection}
            />
          </TabsContent>

          <TabsContent value="media">
            <MediaUploader vehicleId={vehicleId} onUpload={handleMediaUpload} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row justify-between w-full gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (activeTab === "details") {
                router.back()
              } else if (activeTab === "services") {
                setActiveTab("details")
              } else if (activeTab === "media") {
                setActiveTab("services")
              }
            }}
            className="w-full sm:w-auto py-6 sm:py-2"
          >
            {activeTab === "details" ? "Cancel" : "Back"}
          </Button>

          {activeTab === "media" ? (
            <Button
              type="submit"
              form="assessment-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto py-6 sm:py-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Creating...
                </>
              ) : (
                "Create Assessment"
              )}
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (activeTab === "details") {
                  if (form.formState.isValid) {
                    setActiveTab("services")
                  } else {
                    form.trigger()
                  }
                } else if (activeTab === "services") {
                  setActiveTab("media")
                }
              }}
              className="w-full sm:w-auto py-6 sm:py-2"
            >
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
