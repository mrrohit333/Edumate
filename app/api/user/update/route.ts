import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'edumate_jwt_secret_key_2025_secure_and_long_enough'

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase()

    // Get token from header or cookie
    const token = req.headers.get("Authorization")?.replace("Bearer ", "") || 
                 req.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    // Get update data
    const { name, email, profileImage } = await req.json()

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 })
    }

    // Check if email is already taken (excluding current user)
    const existingUser = await User.findOne({ email, _id: { $ne: decoded.id } })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 })
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        name,
        email,
        profileImage,
        updatedAt: new Date(),
      },
      { new: true }
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
} 