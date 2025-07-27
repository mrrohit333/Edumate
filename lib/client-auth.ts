import { apiRequest } from "./api"
import { User } from "@prisma/client"

const USER_KEY = "edumate_user"
const TOKEN_KEY = "edumate_token"

interface AuthResponse {
  success: boolean
  user: User
  token: string
}

export async function login(email: string, password: string): Promise<void> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to login")
    }

    const data: AuthResponse = await response.json()
    
    if (!data.success || !data.user || !data.token) {
      throw new Error("Invalid response from server")
    }

    // Store user data and token in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    localStorage.setItem(TOKEN_KEY, data.token)
  } catch (error: unknown) {
    console.error("Login error:", error)
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to login")
    }
    throw new Error("Failed to login")
  }
}

export async function signup(email: string, password: string, name: string): Promise<User> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Signup failed")
    }

    const data: AuthResponse = await response.json()
    
    if (!data.success || !data.user || !data.token) {
      throw new Error("Invalid response from server")
    }

    // Store user data and token in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    localStorage.setItem(TOKEN_KEY, data.token)

    return data.user
  } catch (error) {
    console.error("Signup error:", error)
    throw error
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || "Failed to logout")
    }

    // Clear user data and token from localStorage
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  } catch (error: any) {
    console.error("Logout error:", error)
    throw new Error(error.message || "Failed to logout")
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return localStorage.getItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!(getUser() && getToken())
}

export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    if (!isAuthenticated()) {
      return null
    }

    const token = getToken()
    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error("Failed to get authenticated user")
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    logout()
    return null
  }
}

