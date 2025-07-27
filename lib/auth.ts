import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import User from "@/models/User"
import { connectToDatabase } from "./mongodb"

const JWT_SECRET = process.env.JWT_SECRET || 'edumate_jwt_secret_key_2025_secure_and_long_enough'

// Simple token verification for Edge Runtime (middleware)
export async function verifyAuth(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; exp: number }
    
    // Check if token is expired
    const currentTimestamp = Math.floor(Date.now() / 1000)
    if (decoded.exp < currentTimestamp) {
      throw new Error('Token expired')
    }
    
    return decoded
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function getAuthUser(req: NextRequest) {
  try {
    await connectToDatabase()

    // Get token from header
    const token = req.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return null
    }

    // Verify token
    const decoded = await verifyAuth(token)

    // Get user from database
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export function generateToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '30d',
  })
}

export function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs')
  return bcrypt.hash(password, 10)
}

export function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  const bcrypt = require('bcryptjs')
  return bcrypt.compare(password, hashedPassword)
}

