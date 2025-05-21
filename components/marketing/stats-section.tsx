"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Car, Calendar, FileText, Users } from "lucide-react"
import CountUp from "react-countup"

interface StatCardProps {
  icon: React.ReactNode
  value: number
  label: string
  prefix?: string
  suffix?: string
  delay?: number
}

function StatCard({ icon, value, label, prefix = "", suffix = "", delay = 0 }: StatCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-60"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/20 p-3 text-primary">{icon}</div>
            <div>
              <h3 className="text-3xl font-bold text-white">
                {prefix}
                {isInView ? <CountUp end={value} duration={2.5} separator="," /> : "0"}
                {suffix}
              </h3>
              <p className="text-gray-400">{label}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const stats = [
    {
      icon: <Car className="h-6 w-6" />,
      value: 250000,
      label: "Vehicles Managed",
      delay: 0.1,
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      value: 1200000,
      label: "Appointments Scheduled",
      delay: 0.2,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      value: 850000,
      label: "Invoices Generated",
      delay: 0.3,
    },
    {
      icon: <Users className="h-6 w-6" />,
      value: 2500,
      label: "Active Businesses",
      delay: 0.4,
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute right-1/4 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Powering the Automotive Service Industry
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Our platform processes millions of transactions and helps thousands of businesses streamline their
            operations.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} icon={stat.icon} value={stat.value} label={stat.label} delay={stat.delay} />
          ))}
        </div>
      </div>
    </section>
  )
}
