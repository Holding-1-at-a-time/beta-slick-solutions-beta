"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  imageUrl?: string
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  imageUrl = "/modern-vehicle-service.png",
}: HeroSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 1])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const buttonVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  }

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Background subtle animation */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
      </motion.div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="flex flex-col justify-center space-y-4" variants={containerVariants}>
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                variants={itemVariants}
              >
                {title}
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
            </div>
            <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" variants={containerVariants}>
              <motion.div variants={buttonVariants} whileHover="hover">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 transition-all duration-300">
                  <Link href={ctaLink}>{ctaText}</Link>
                </Button>
              </motion.div>

              {secondaryCtaText && secondaryCtaLink && (
                <motion.div variants={buttonVariants} whileHover="hover">
                  <Button asChild variant="outline" size="lg" className="transition-all duration-300">
                    <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            style={{ scale: imageScale, opacity: imageOpacity }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <motion.img
              src={imageUrl || "/placeholder.svg"}
              alt="Hero Image"
              width={800}
              height={600}
              className="aspect-video overflow-hidden rounded-xl object-cover object-center shadow-lg"
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements for depth */}
      <motion.div
        className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{
          y: [0, -15, 0],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 1,
        }}
      />
    </section>
  )
}
