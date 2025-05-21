"use client"

import { type ReactNode, createContext, useContext, useState, useEffect } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  userId: string | null
  userEmail: string | null
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  userEmail: null,
})

export const useAuthContext = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
  loadingComponent?: ReactNode
  fallback?: ReactNode
}

export function AuthProvider({
  children,
  loadingComponent = <AuthLoadingState />,
  fallback = null,
}: AuthProviderProps) {
  const { isAuthenticated: isClerkAuthenticated, isLoading: isClerkLoading } = useAuth()
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } = useConvexAuth()
  const { user, isLoaded: isUserLoaded } = useUser()

  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    userEmail: null,
  })

  useEffect(() => {
    const isLoading = isClerkLoading || isConvexLoading || !isUserLoaded
    const isAuthenticated = isClerkAuthenticated && isConvexAuthenticated && isUserLoaded

    if (!isLoading) {
      setAuthState({
        isAuthenticated,
        isLoading: false,
        userId: user?.id || null,
        userEmail: user?.primaryEmailAddress?.emailAddress || null,
      })
    }
  }, [isClerkAuthenticated, isClerkLoading, isConvexAuthenticated, isConvexLoading, isUserLoaded, user])

  if (authState.isLoading) {
    return <>{loadingComponent}</>
  }

  if (!authState.isAuthenticated) {
    return <>{fallback}</>
  }

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
}

function AuthLoadingState() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size="lg" />
      <span className="ml-2 text-lg">Authenticating...</span>
    </div>
  )
}
