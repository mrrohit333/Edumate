import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Assessment from '@/models/Assessment'; // Import the Assessment model
import { connectDB } from '../../../lib/mongoose'; // Import connectDB
import bcrypt from 'bcryptjs'; // Import bcryptjs for password comparison

// MongoDB connection status
let isConnected = false; // Assuming you have a connection status

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw new Error('Database connection failed');
  }
};


export async function POST(request: Request) {
  try {
    await connectDB(); // Ensure database connection

    const { assessmentId, password } = await request.json();

    if (!assessmentId || !password) {
      return NextResponse.json({ success: false, message: 'Assessment ID and password are required.' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      return NextResponse.json({ success: false, message: 'Invalid assessment ID format.' }, { status: 400 });
    }

    const assessment = await Assessment.findById(assessmentId).select('+password');

    if (!assessment) {
      return NextResponse.json({ success: false, message: 'Assessment not found.' }, { status: 404 });
    }

    const isPasswordRequired = !!assessment.password;

    if (isPasswordRequired) {
      console.log('Received password:', password);
      console.log('Stored hashed password:', assessment.password);
      const isPasswordCorrect = await bcrypt.compare(password, assessment.password);
      if (isPasswordCorrect) {
        return NextResponse.json({ success: true, isPasswordRequired });
      } else {
        return NextResponse.json({ success: false, message: 'Incorrect password.' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ success: true, isPasswordRequired });
    }
  } catch (error: any) {
    console.error('Password verification error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to verify password.' }, { status: 500 });
  }
} 