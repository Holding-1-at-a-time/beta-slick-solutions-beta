"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import TextBlock from "@/components/marketing/text-block"
import { motion } from "framer-motion"
import { ChevronRight, Star } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 md:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/50 px-4 py-1.5 text-sm backdrop-blur-sm"
            >
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <span className="text-gray-300">Trusted by 2,500+ automotive businesses</span>
            </motion.div>

            <TextBlock
              subtitle="Next-Gen Vehicle Service Platform"
              title="Revolutionize Your Automotive Business"
              description="Our enterprise-grade SaaS solution empowers vehicle service businesses with AI-driven scheduling, real-time analytics, and seamless customer experiences."
              titleSize="lg"
              theme="dark"
            />

            <div className="flex flex-col gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group"
                >
                  <Link href="/sign-up" className="flex items-center gap-2">
                    Get Started
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-medium border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Link href="#features">Explore Features</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="mt-4 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-10 w-10 rounded-full border-2 border-gray-900 bg-gray-800 overflow-hidden"
                  >
                    <Image
                      src={`/diverse-group.png?height=40&width=40&query=person ${i}`}
                      alt={`Customer ${i}`}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-white">2,500+</span> businesses trust our platform
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative mx-auto max-w-lg lg:max-w-none"
            initial={{ opacity: 0, scale: 0.8, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative rounded-xl bg-gray-900/50 p-2 shadow-2xl backdrop-blur-sm border border-gray-800 transform perspective-1000">
              <div className="aspect-[4/3] w-full rounded-lg bg-gray-800 overflow-hidden">
                <Image
                  src="/futuristic-car-service-dashboard-dark-mode.png"
                  alt="Vehicle Service Dashboard"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-60"></div>
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute -right-8 -top-8 h-16 w-16 rounded-lg bg-primary/30 backdrop-blur-md"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-8 -left-8 h-16 w-16 rounded-lg bg-blue-500/20 backdrop-blur-md"
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut", delay: 1 }}
              ></motion.div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
