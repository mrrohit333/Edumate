import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = cookies()
  
  // Clear the auth cookie
  cookieStore.delete("auth-token")
  
  return NextResponse.json({ message: "Logged out successfully" })
} 