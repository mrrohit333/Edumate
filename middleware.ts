import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'edumate_jwt_secret_key_2025_secure_and_long_enough'

// List of protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboard/practice",
  "/dashboard/documents",
  "/dashboard/lessons",
  "/dashboard/progress",
  "/dashboard/profile",
  "/dashboard/settings",
]

// List of auth routes that should redirect to dashboard if already logged in
const authRoutes = ["/login.html", "/signup.html", "/forgot-password.html"]

// List of paths that don't require authentication
const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/']

function verifyTokenStructure(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; exp: number }
    const currentTimestamp = Math.floor(Date.now() / 1000)
    return decoded.exp > currentTimestamp
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath))

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value

  // If the path requires authentication and there's no token
  if (!isPublicPath && !token) {
    // Create the callbackUrl
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname)
    
    // Redirect to the login page with the callbackUrl
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
    )
  }

  // If there's a token and the user is trying to access auth pages
  if (token && isPublicPath && path !== '/') {
    // Redirect to the dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

