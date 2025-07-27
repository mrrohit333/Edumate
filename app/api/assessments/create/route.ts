import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Assessment, { IAssessment } from '@/models/Assessment'; // Import the Assessment model
import { connectDB } from '../../../lib/mongoose'; // Import connectDB
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

// MongoDB connection status
let isConnected = false;

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

    const assessmentData: IAssessment = await request.json();

    // Basic validation (can be expanded)
    if (!assessmentData.title || !assessmentData.startTime || !assessmentData.endTime || !assessmentData.questions || assessmentData.questions.length === 0 || assessmentData.timer === undefined) {
      return NextResponse.json({ success: false, message: 'Missing required assessment fields.' }, { status: 400 });
    }

    // Hash the password if provided
    if (assessmentData.password) {
      const salt = await bcrypt.genSalt(10);
      assessmentData.password = await bcrypt.hash(assessmentData.password, salt);
    }

    // Create a new assessment instance
    const newAssessment = new Assessment(assessmentData);

    // Save the assessment to the database
    await newAssessment.save();

    console.log(`Assessment created: ${newAssessment.title}`);

    return NextResponse.json({ success: true, message: 'Assessment created successfully!', assessmentId: newAssessment._id });

  } catch (error: any) {
    console.error('Create assessment error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create assessment.' }, { status: 500 });
  }
} 