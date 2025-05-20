"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Calendar, FileText, Shield, Zap, BarChart } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}

function FeatureCard({ title, description, icon, index }: FeatureCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
        <CardHeader className="pb-2 relative">
          <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
            {icon}
          </div>
          <CardTitle className="text-xl text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <CardDescription className="text-base text-gray-400">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function FeatureSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const features = [
    {
      title: "Intelligent Vehicle Management",
      description:
        "Track and manage your entire fleet with detailed service history, automated maintenance alerts, and real-time status updates.",
      icon: <Car className="h-6 w-6" />,
    },
    {
      title: "AI-Powered Scheduling",
      description:
        "Our machine learning algorithms optimize appointment scheduling based on staff availability, service duration, and customer preferences.",
      icon: <Calendar className="h-6 w-6" />,
    },
    {
      title: "Seamless Digital Invoicing",
      description:
        "Generate professional invoices automatically with integrated payment processing and automated follow-ups for outstanding balances.",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Enterprise-Grade Security",
      description:
        "Multi-tenant architecture with advanced encryption ensures your data remains private, secure, and compliant with industry standards.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Real-time Notifications",
      description:
        "Keep customers informed with automated updates about service progress, appointment reminders, and important vehicle alerts.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Advanced Business Analytics",
      description:
        "Gain actionable insights with comprehensive reporting on service trends, revenue streams, and operational efficiency metrics.",
      icon: <BarChart className="h-6 w-6" />,
    },
  ]

  return (
    <section id="features" ref={ref} className="py-24 md:py-32 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Enterprise-Grade Features
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400 text-lg">
            Our comprehensive vehicle service platform provides everything you need to scale your automotive business
            efficiently.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
