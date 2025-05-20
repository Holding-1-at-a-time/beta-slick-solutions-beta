"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function HeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-20 md:py-32 lg:py-40">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-6"
          >
            {/* Trust badge */}
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-medium">Trusted by 1,000+ automotive businesses</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              AI-Powered Vehicle <span className="text-primary">Service Management</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-lg">
              Streamline your automotive service business with our all-in-one platform. From AI-powered damage
              assessment to intelligent scheduling and customer management.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <Link href="/contact">Schedule Demo</Link>
              </Button>
            </div>

            {/* Feature bullets */}
            <div className="mt-4 grid gap-3 text-gray-300 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm">AI Damage Assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm">Smart Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm">Digital Invoicing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/20 p-1">
                  <svg
                    className="h-3 w-3 text-primary"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm">Customer Portal</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto lg:ml-auto"
          >
            <div className="relative">
              {/* Main image */}
              <div className="overflow-hidden rounded-xl border border-gray-800 shadow-2xl shadow-primary/10">
                <Image
                  src="/futuristic-car-service-dashboard-dark-mode.png"
                  alt="AI-powered vehicle service dashboard"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                  priority
                />
              </div>

              {/* Floating element 1 */}
              <div className="absolute -left-12 top-1/2 hidden -translate-y-1/2 lg:block">
                <div className="rounded-lg border border-gray-800 bg-gray-900/90 p-4 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/20 p-2">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path>
                        <path d="M19 21H5a2 2 0 0 1-2-2V7h18v12a2 2 0 0 1-2 2Z"></path>
                        <path d="M9 17h6"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">AI Analysis</p>
                      <p className="text-xs text-gray-400">Damage detected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating element 2 */}
              <div className="absolute -right-12 bottom-12 hidden lg:block">
                <div className="rounded-lg border border-gray-800 bg-gray-900/90 p-4 shadow-xl backdrop-blur-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-400">Repair Progress</p>
                      <p className="text-xs font-medium text-white">75%</p>
                    </div>
                    <div className="h-1.5 w-36 overflow-hidden rounded-full bg-gray-800">
                      <div className="h-full w-3/4 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
