"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Home, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  BookOpen, 
  FileText, 
  BarChart,
  Menu,
  X,
  ClipboardList
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUser, logout, isAuthenticated } from "@/lib/client-auth"

interface UserType {
  name?: string
  email?: string
  image?: string
  profileImage?: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check if the current path is the create assessment page
  const isCreateAssessmentPage = router.pathname === '/dashboard/assessments/create'

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated()) {
          router.push("/login")
          return
        }
        
        const userData = getUser()
        if (userData) {
          setUser(userData)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
    { name: "SGPA/CGPA Calculator", href: "/dashboard/calculator", icon: BarChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      {!isCreateAssessmentPage && (
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>
      )}

      {/* Sidebar */}
      {!isCreateAssessmentPage && (
      <div className={`
        fixed top-0 left-0 z-40 w-64 h-screen transition-transform
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-card border-r">
          <div className="flex items-center mb-6 p-2">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-0 right-0 px-3">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
      )}

      {/* Main content */}
      <div className={isCreateAssessmentPage ? 'w-full' : 'lg:pl-64'}>
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
} 