"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { isMobile } = useMobile()

  const headlines = [
    "Transform Your Vehicle Service Business",
    "AI-Powered Vehicle Assessments",
    "Streamline Customer Management",
    "Optimize Your Service Workflow",
  ]

  const descriptions = [
    "Our all-in-one platform helps you manage appointments, assessments, and customer relationships with ease.",
    "Leverage AI to detect vehicle issues from images and generate accurate service recommendations.",
    "Keep track of customer vehicles, service history, and preferences in one centralized system.",
    "Automate scheduling, invoicing, and follow-ups to save time and improve customer satisfaction.",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % headlines.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [headlines.length])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-12 md:py-24">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Text content */}
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Next-Generation SaaS Platform
              </div>
              <div className="h-24 sm:h-20">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={`headline-${activeIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl"
                  >
                    {headlines[activeIndex]}
                  </motion.h1>
                </AnimatePresence>
              </div>
              <div className="h-24 sm:h-20">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`description-${activeIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-lg text-gray-600"
                  >
                    {descriptions[activeIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild size={isMobile ? "default" : "lg"} className="font-medium">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="font-medium">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
              <div className="flex space-x-2 pt-4">
                {headlines.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 w-2 rounded-full ${
                      activeIndex === index ? "bg-primary" : "bg-gray-300"
                    } transition-colors`}
                    aria-label={`View slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img
                  src="/futuristic-car-service-dashboard-dark-mode.png"
                  alt="Vehicle service dashboard"
                  className="w-full max-w-lg rounded-lg object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-primary/20 to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
