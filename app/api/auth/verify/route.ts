import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'edumate_jwt_secret_key_2025_secure_and_long_enough'

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    // Get token from header
    const token = req.headers.get("Authorization")?.replace("Bearer ", "") || 
                 req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    // Get user from database
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 401 })
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
  }
} 