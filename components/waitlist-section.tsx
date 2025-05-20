"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Waitlist } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ArrowRight } from "lucide-react"

export default function WaitlistSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Be the First to Experience the Future of Vehicle Service
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join our exclusive waitlist to get early access to our platform and special launch offers.
          </p>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group">
                <span>Join the Waitlist</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] bg-gray-900 border-gray-800 rounded-t-3xl">
              <div className="max-w-md mx-auto pt-8">
                <Waitlist />
              </div>
            </SheetContent>
          </Sheet>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-8 w-8 rounded-full border-2 border-gray-900 bg-gray-800 overflow-hidden"
                  >
                    <img
                      src={`/diverse-group.png?height=32&width=32&query=person ${i}`}
                      alt={`Person ${i}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-400">
                <span className="font-semibold text-white">350+</span> people already joined
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">Limited spots available</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
