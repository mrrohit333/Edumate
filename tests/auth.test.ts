import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

describe('Authentication Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    process.env.MONGODB_URI = 'mongodb://localhost:27017/edumate_test'
    await connectToDatabase()
  })

  afterAll(async () => {
    // Clean up test database
    await User.deleteMany({})
    await mongoose.connection.close()
  })

  describe('User Registration', () => {
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    }

    it('should create a new user', async () => {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      })

      const data = await response.json()
      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.user.email).toBe(testUser.email)
      expect(data.token).toBeDefined()
    })

    it('should not create user with existing email', async () => {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      })

      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Email already registered')
    })
  })

  describe('User Login', () => {
    const loginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    it('should login with correct credentials', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginCredentials)
      })

      const data = await response.json()
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user.email).toBe(loginCredentials.email)
      expect(data.token).toBeDefined()
    })

    it('should not login with incorrect password', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginCredentials.email,
          password: 'wrongpassword'
        })
      })

      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Invalid credentials')
    })

    it('should not login with non-existent email', async () => {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
      })

      const data = await response.json()
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Invalid credentials')
    })
  })
}) 