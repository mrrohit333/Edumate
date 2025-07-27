import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Assessment, { IAssessment } from '@/models/Assessment'; // Import the Assessment model
import { connectDB } from '@/lib/mongoose'; // Import connectDB
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options'; // Corrected import path

export async function GET(
  request: Request,
  { params }: { params: { assessmentid: string } }
) {
  try {
    // Check for authenticated session
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    // }

    // Ensure database connection
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    const awaitedParams = await params;
    const { assessmentid } = awaitedParams;

    if (!mongoose.Types.ObjectId.isValid(assessmentid)) {
      return NextResponse.json(
        { success: false, message: 'Invalid assessment ID format.' },
        { status: 400 }
      );
    }

    try {
      // Fetch the assessment. Temporarily include password to check if it exists.
      const assessment = await Assessment.findById(assessmentid).select('-questions.correctAnswer');

      if (!assessment) {
        return NextResponse.json(
          { success: false, message: 'Assessment not found.' },
          { status: 404 }
        );
      }

      // Check if the assessment is active based on UTC dates with a small buffer
      const nowUtc = new Date().getTime();
      const startTimeUtc = new Date(assessment.startTime).getTime();
      const endTimeUtc = new Date(assessment.endTime).getTime();
      const bufferInMilliseconds = 5000; // 5 second buffer

      if (nowUtc < startTimeUtc - bufferInMilliseconds || nowUtc > endTimeUtc + bufferInMilliseconds) {
        console.log(
          `Assessment Inactive: ID=${assessmentid}, Now(UTC)=${new Date(nowUtc).toISOString()}, Start(UTC)=${new Date(
            startTimeUtc
          ).toISOString()}, End(UTC)=${new Date(endTimeUtc).toISOString()}`
        );
        return NextResponse.json(
          { success: false, message: 'Assessment is not currently active.' },
          { status: 400 }
        );
      }

      // Determine if a password is required
      const isPasswordRequired = !!assessment.password;

      // Create a response object, EXCLUDING the actual password hash
      const assessmentResponse = assessment.toObject();
      delete assessmentResponse.password;

      return NextResponse.json({
        success: true,
        assessment: assessmentResponse,
        isPasswordRequired,
      });
    } catch (error) {
      console.error('Database operation error:', error);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch assessment from database.',
          error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Fetch assessment by ID error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch assessment.',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
} 