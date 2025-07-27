import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key'

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase()

    // Parse request body
    const { name, email, password, profileImage } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      )
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      profileImage: profileImage || ''
    })

    // Create token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json(
      {
        success: true,
        token,
        user: userResponse
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred during signup" },
      { status: 500 }
    )
  }
}

