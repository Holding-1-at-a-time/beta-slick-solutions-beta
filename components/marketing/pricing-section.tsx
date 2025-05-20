"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

interface PricingPlanProps {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  index: number
}

function PricingPlan({ name, price, description, features, popular = false, index }: PricingPlanProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <Card
        className={`h-full flex flex-col border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden relative ${
          popular ? "border-primary shadow-lg shadow-primary/10" : ""
        }`}
      >
        {popular && (
          <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Most Popular
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
        <CardHeader className={`relative ${popular ? "pt-8" : ""}`}>
          <CardTitle className="text-xl text-white">{name}</CardTitle>
          <CardDescription className="text-gray-400">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 relative">
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">{price}</span>
            {price !== "Custom" && <span className="text-gray-400">/month</span>}
          </div>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="relative">
          <Button
            asChild
            className={`w-full ${
              popular
                ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
            variant={popular ? "default" : "outline"}
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const plans = [
    {
      name: "Starter",
      price: "$49",
      description: "Perfect for small shops just getting started",
      features: [
        "Up to 3 staff members",
        "50 vehicle records",
        "Basic appointment scheduling",
        "Digital invoicing",
        "Email notifications",
        "24/7 support",
      ],
    },
    {
      name: "Professional",
      price: "$99",
      description: "Ideal for growing service centers",
      features: [
        "Up to 10 staff members",
        "Unlimited vehicle records",
        "Advanced scheduling with AI",
        "Custom invoicing & estimates",
        "SMS & email notifications",
        "Analytics dashboard",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large operations with multiple locations",
      features: [
        "Unlimited staff members",
        "Multi-location support",
        "Advanced analytics & reporting",
        "Custom integration options",
        "Dedicated account manager",
        "SLA guarantees",
        "White-label options",
      ],
    },
  ]

  return (
    <section id="pricing" ref={ref} className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute right-1/3 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Transparent, Value-Driven Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-lg">
            Choose the plan that works best for your business. All plans include a 14-day free trial with no credit card
            required.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingPlan
              key={index}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              popular={plan.popular}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400">
            Need a custom solution?{" "}
            <a href="#contact" className="font-medium text-primary hover:underline">
              Contact us
            </a>{" "}
            for a tailored quote.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
