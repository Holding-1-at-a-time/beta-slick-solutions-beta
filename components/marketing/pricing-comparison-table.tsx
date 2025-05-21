"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, HelpCircle, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type FeatureType = {
  name: string
  description?: string
  starter: boolean | string
  professional: boolean | string
  enterprise: boolean | string
}

const features: FeatureType[] = [
  {
    name: "Staff Members",
    starter: "Up to 3",
    professional: "Up to 10",
    enterprise: "Unlimited",
  },
  {
    name: "Vehicle Records",
    starter: "50",
    professional: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    name: "Appointment Scheduling",
    description: "Schedule and manage service appointments",
    starter: "Basic",
    professional: "Advanced",
    enterprise: "Advanced",
  },
  {
    name: "AI-Powered Scheduling",
    description: "Intelligent scheduling based on staff availability and service duration",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Digital Invoicing",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Custom Estimates",
    description: "Create detailed custom estimates for clients",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Email Notifications",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "SMS Notifications",
    starter: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Analytics Dashboard",
    description: "Detailed business analytics and reporting",
    starter: "Basic",
    professional: "Advanced",
    enterprise: "Enterprise",
  },
  {
    name: "Customer Portal",
    description: "Allow customers to view their vehicles and service history",
    starter: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Multi-Location Support",
    description: "Manage multiple service locations from one account",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "API Access",
    description: "Access to our API for custom integrations",
    starter: false,
    professional: "Limited",
    enterprise: "Full",
  },
  {
    name: "White Labeling",
    description: "Custom branding options for customer-facing interfaces",
    starter: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Support",
    starter: "Email",
    professional: "Priority Email & Chat",
    enterprise: "Dedicated Account Manager",
  },
  {
    name: "SLA Guarantees",
    description: "Service Level Agreement with uptime guarantees",
    starter: false,
    professional: false,
    enterprise: true,
  },
]

export default function PricingComparisonTable() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} className="py-16 md:py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Compare Features</h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-lg">Detailed breakdown of what's included in each plan</p>
        </motion.div>

        <div className="overflow-x-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="min-w-max"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-4 px-6 text-left text-gray-400 font-normal w-1/4">Features</th>
                  <th className="py-4 px-6 text-center w-1/4">
                    <div className="text-white font-bold text-lg">Starter</div>
                    <div className="text-primary text-2xl font-bold mt-1">$49</div>
                    <div className="text-gray-400 text-sm">per month</div>
                  </th>
                  <th className="py-4 px-6 text-center w-1/4 bg-gray-900/30 rounded-t-lg">
                    <div className="text-white font-bold text-lg">Professional</div>
                    <div className="text-primary text-2xl font-bold mt-1">$99</div>
                    <div className="text-gray-400 text-sm">per month</div>
                    <div className="mt-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  </th>
                  <th className="py-4 px-6 text-center w-1/4">
                    <div className="text-white font-bold text-lg">Enterprise</div>
                    <div className="text-primary text-2xl font-bold mt-1">Custom</div>
                    <div className="text-gray-400 text-sm">contact for pricing</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className={cn(
                      "border-b border-gray-800 hover:bg-gray-900/20 transition-colors",
                      index % 2 === 0 ? "bg-gray-900/10" : "",
                    )}
                  >
                    <td className="py-4 px-6 text-left">
                      <div className="flex items-center">
                        <span className="text-gray-300">{feature.name}</span>
                        {feature.description && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 ml-2 text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-64">{feature.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.starter === "boolean" ? (
                        feature.starter ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-300">{feature.starter}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-gray-900/30">
                      {typeof feature.professional === "boolean" ? (
                        feature.professional ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-300">{feature.professional}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof feature.enterprise === "boolean" ? (
                        feature.enterprise ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-300">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
