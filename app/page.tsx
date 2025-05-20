"use client"

import { useEffect } from "react"
import Script from "next/script"
import Header from "@/components/marketing/header"
import HeroSection from "@/components/marketing/hero-section"
import FeatureSection from "@/components/marketing/feature-section"
import StatsSection from "@/components/marketing/stats-section"
import TestimonialCarousel from "@/components/marketing/testimonial-carousel"
import PricingSection from "@/components/marketing/pricing-section"
import WaitlistSection from "@/components/waitlist-section"
import Footer from "@/components/marketing/footer"

export default function LandingPage() {
  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')

      if (anchor) {
        e.preventDefault()
        const targetId = anchor.getAttribute("href")
        if (targetId && targetId !== "#") {
          const targetElement = document.querySelector(targetId)
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
              behavior: "smooth",
            })
          }
        }
      }
    }

    document.addEventListener("click", handleAnchorClick)
    return () => document.removeEventListener("click", handleAnchorClick)
  }, [])

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "VehicleService",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "49.00",
      priceCurrency: "USD",
    },
    description: "AI-powered vehicle service management platform for automotive businesses.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Structured data for SEO */}
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>

      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <TestimonialCarousel />
        <FeatureSection />
        <PricingSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  )
}
