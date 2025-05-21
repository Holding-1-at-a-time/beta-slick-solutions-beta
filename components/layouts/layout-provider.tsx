"use client"

import { type ReactNode, createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

type LayoutType = "default" | "dashboard" | "admin" | "client" | "member" | "marketing" | "minimal"

interface LayoutContextType {
  layoutType: LayoutType
  setLayoutType: (type: LayoutType) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  headerHeight: number
  setHeaderHeight: (height: number) => void
  footerHeight: number
  setFooterHeight: (height: number) => void
}

const LayoutContext = createContext<LayoutContextType>({
  layoutType: "default",
  setLayoutType: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},
  headerHeight: 64,
  setHeaderHeight: () => {},
  footerHeight: 0,
  setFooterHeight: () => {},
})

export const useLayoutContext = () => useContext(LayoutContext)

interface LayoutProviderProps {
  children: ReactNode
  initialLayoutType?: LayoutType
  initialSidebarOpen?: boolean
  className?: string
}

export function LayoutProvider({
  children,
  initialLayoutType = "default",
  initialSidebarOpen = true,
  className,
}: LayoutProviderProps) {
  const [layoutType, setLayoutType] = useState<LayoutType>(initialLayoutType)
  const [sidebarOpen, setSidebarOpen] = useState(initialSidebarOpen)
  const [headerHeight, setHeaderHeight] = useState(64)
  const [footerHeight, setFooterHeight] = useState(0)

  return (
    <LayoutContext.Provider
      value={{
        layoutType,
        setLayoutType,
        sidebarOpen,
        setSidebarOpen,
        headerHeight,
        setHeaderHeight,
        footerHeight,
        setFooterHeight,
      }}
    >
      <div className={cn("min-h-screen flex flex-col", className)}>{children}</div>
    </LayoutContext.Provider>
  )
}
