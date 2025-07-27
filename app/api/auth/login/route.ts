import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import jwt from "jsonwebtoken"
import { sendLoginNotificationEmail } from "@/lib/email"
import { headers } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key'

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase()

    // Parse request body
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide email and password" },
        { status: 400 }
      )
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password

    // Get client IP and user agent for security notification
    const headersList = headers();
    const ipAddress = req.ip || headersList.get('x-forwarded-for') || 'Unknown';
    const userAgent = headersList.get('user-agent') || 'Unknown';

    // Send login notification email
    try {
      console.log(`Attempting to send login notification to ${user.email}`);
      
      const emailSent = await sendLoginNotificationEmail(
        user.email,
        user.name,
        ipAddress.toString(),
        userAgent
      );
      
      if (emailSent) {
        console.log(`Login notification email successfully sent to ${user.email}`);
      } else {
        console.warn(`Could not send login notification email to ${user.email} - email service returned failure`);
      }
    } catch (error) {
      console.error('Failed to send login notification email:', error);
      // Continue with login process even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        token,
        user: userResponse
      },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred during login" },
      { status: 500 }
    )
  }
}

