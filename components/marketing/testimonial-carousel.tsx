"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import TextBlock from "@/components/marketing/text-block"
import { Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  company: string
  image?: string
}

const testimonials: TestimonialProps[] = [
  {
    quote:
      "This platform has completely transformed how we manage our auto repair shop. The scheduling system alone has saved us countless hours and reduced no-shows by 35%.",
    author: "Michael Rodriguez",
    role: "Owner",
    company: "Elite Auto Service",
    image: "/diverse-group.png",
  },
  {
    quote:
      "The customer portal is a game-changer. Our clients love being able to see their vehicle history, upcoming appointments, and invoices all in one place.",
    author: "Sarah Johnson",
    role: "Service Manager",
    company: "Precision Motors",
    image: "/diverse-woman-portrait.png",
  },
  {
    quote:
      "As a multi-location dealership, we needed a solution that could scale with us. This platform delivers with robust reporting and seamless communication across all our service centers.",
    author: "David Chen",
    role: "Operations Director",
    company: "Metro Auto Group",
    image: "/diverse-businessman.png",
  },
  {
    quote:
      "The AI-powered assessment tool has revolutionized our inspection process. We're catching issues we might have missed before, and our customers appreciate the detailed reports.",
    author: "Jennifer Williams",
    role: "Service Advisor",
    company: "AutoCare Plus",
    image: "/professional-woman-diverse.png",
  },
  {
    quote:
      "Implementing this platform was seamless. The onboarding process was thorough, and the support team has been incredibly responsive whenever we've had questions.",
    author: "Robert Kim",
    role: "IT Manager",
    company: "Pacific Auto Group",
    image: "/placeholder-pp22r.png",
  },
]

function TestimonialCard({ quote, author, role, company, image }: TestimonialProps) {
  return (
    <Card className="h-full border-gray-200 shadow-md">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-start gap-4">
          <Quote className="h-8 w-8 flex-shrink-0 text-primary/40" />
          {image && (
            <div className="ml-auto">
              <img
                src={image || "/placeholder.svg"}
                alt={`${author}`}
                className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
              />
            </div>
          )}
        </div>
        <p className="mt-4 flex-1 text-lg text-gray-700 italic">{quote}</p>
        <div className="mt-6 border-t border-gray-100 pt-4">
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-600">
            {role}, {company}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextTestimonial = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }, [])

  const prevTestimonial = useCallback(() => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)

    return () => clearInterval(interval)
  }, [nextTestimonial, isPaused])

  // Pause auto-advance on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 bg-gray-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4">
        <TextBlock
          title="Trusted by Automotive Professionals"
          description="Don't just take our word for it. Here's what our customers have to say about our platform."
          align="center"
          className="mb-12"
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === activeIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
