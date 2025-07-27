import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Assessment, { IAssessment } from '../../../models/Assessment'; // Import the Assessment model
import { connectDB } from '../../../lib/mongoose'; // Import connectDB
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth-options';

// MongoDB connection status
let isConnected = false;

export async function GET() {
  try {
    await connectDB(); // Ensure database connection

    // Fetch all assessments, excluding the questions and password for the list view
    const assessments = await Assessment.find({}).select('-questions -password').sort({ createdAt: -1 });

    console.log(`Fetched ${assessments.length} assessments.`);

    return NextResponse.json({ success: true, assessments });

  } catch (error: any) {
    console.error('Fetch assessments error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch assessments.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in POST /api/submissions:", session);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This part, including the database save, is only reached if a session is found
    const body = await req.json();
    const { assessmentId, answers } = body;
    // ... rest of the submission logic including UserSubmission.create
  } catch (error) {
    // ... error handling
  }
} 