"use client"

import { useState, useEffect } from "react"

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState<ScreenSize>("lg")

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === "undefined") return

    const checkIfMobile = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)

      if (width < 640) setScreenSize("xs")
      else if (width < 768) setScreenSize("sm")
      else if (width < 1024) setScreenSize("md")
      else if (width < 1280) setScreenSize("lg")
      else if (width < 1536) setScreenSize("xl")
      else setScreenSize("2xl")
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return {
    isMobile,
    screenSize,
    isXs: screenSize === "xs",
    isSm: screenSize === "sm",
    isMd: screenSize === "md",
    isLg: screenSize === "lg",
    isXl: screenSize === "xl",
    is2xl: screenSize === "2xl",
    isMobileOrTablet: ["xs", "sm", "md"].includes(screenSize),
  }
}
