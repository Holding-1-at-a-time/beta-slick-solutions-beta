"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  image: string
}

export default function TestimonialCarousel() {
  const testimonials: Testimonial[] = [
    {
      quote:
        "This platform has completely transformed how we manage our auto repair shop. The scheduling system alone has saved us countless hours and reduced no-shows by 35%. The customer portal is intuitive and our clients love it.",
      author: "Michael Rodriguez",
      role: "Owner",
      company: "Elite Auto Service",
      image: "/diverse-businessman.png",
    },
    {
      quote:
        "The customer portal is a game-changer. Our clients love being able to see their vehicle history, upcoming appointments, and invoices all in one place. It's dramatically improved our customer satisfaction scores.",
      author: "Sarah Johnson",
      role: "Service Manager",
      company: "Precision Motors",
      image: "/diverse-woman-portrait.png",
    },
    {
      quote:
        "As a multi-location dealership, we needed a solution that could scale with us. This platform delivers with robust reporting and seamless communication across all our service centers. The ROI has been incredible.",
      author: "David Chen",
      role: "Operations Director",
      company: "Metro Auto Group",
      image: "/professional-woman-diverse.png",
    },
    {
      quote:
        "The AI-powered scheduling has been revolutionary for our business. It optimizes our technicians' time perfectly and has increased our service capacity by 22% without adding staff. I can't imagine running our shop without it now.",
      author: "Priya Patel",
      role: "CEO",
      company: "AutoTech Solutions",
      image: "/diverse-group.png",
    },
    {
      quote:
        "Implementation was surprisingly smooth. The team provided excellent support, and we were fully operational within days. The analytics dashboard gives me insights I never had before, helping us make data-driven decisions.",
      author: "James Wilson",
      role: "Service Director",
      company: "Luxury Auto Care",
      image: "/placeholder-pp22r.png",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
  }

  // Handle autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextTestimonial()
      }, 6000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying])

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  return (
    <section
      id="testimonials"
      className="py-24 relative overflow-hidden bg-gradient-to-b from-black to-gray-900"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Automotive Professionals
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about our platform.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial carousel */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="p-8 md:p-12"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden border-4 border-primary/20">
                      <Image
                        src={testimonials[currentIndex].image || "/placeholder.svg"}
                        alt={testimonials[currentIndex].author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <Quote className="h-10 w-10 text-primary/40 mb-4" />
                    <p className="text-xl md:text-2xl text-gray-200 italic mb-6 leading-relaxed">
                      "{testimonials[currentIndex].quote}"
                    </p>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{testimonials[currentIndex].author}</h4>
                      <p className="text-gray-400">
                        {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "bg-primary w-6" : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
