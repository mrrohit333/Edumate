"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { User } from "@prisma/client"
import { getUser, logout as clientLogout, getAuthenticatedUser } from "@/lib/client-auth"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
})

const publicPaths = ["/login", "/signup", "/forgot-password", "/reset-password", "/"]
const authRedirectPaths = ["/login", "/signup", "/forgot-password", "/reset-password"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  const refreshUser = async () => {
    try {
      const currentUser = await getAuthenticatedUser()
      setUser(currentUser)
      return currentUser
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
      throw error
    }
  }

  // Check authentication status
  useEffect(() => {
    if (!mounted) return

    const checkAuth = async () => {
      try {
        const storedUser = getUser()
        if (storedUser) {
          // Verify the stored user with the server
          const currentUser = await getAuthenticatedUser()
          setUser(currentUser)

          if (!currentUser && !publicPaths.includes(pathname)) {
            // Token is invalid or expired
            router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
          }
        } else if (!publicPaths.includes(pathname)) {
          // Redirect to login if not authenticated and trying to access protected route
          router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
        if (!publicPaths.includes(pathname)) {
          router.replace("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname, mounted])

  const logout = async () => {
    try {
      await clientLogout()
      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.replace("/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

