import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UserSubmission } from '@/models/UserSubmission';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { connectDB } from '@/lib/mongoose';
import mongoose from 'mongoose';

// GET user's submissions
export async function GET(
  request: Request,
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json({ success: false, message: 'Missing assessmentId query parameter.' }, { status: 400 });
    }

    const submission = await UserSubmission.findOne({ userId, assessmentId }).sort({ createdAt: -1 }); // Get the latest submission

    return NextResponse.json({ success: true, submission });

  } catch (error: any) {
    console.error('Fetch submission error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch submission.' }, { status: 500 });
  }
}

// POST new submission
export async function POST(request: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json({ success: false, message: 'Missing assessmentId.' }, { status: 400 });
    }

    const existingSubmission = await UserSubmission.findOne({ userId, assessmentId, status: { $ne: 'TERMINATED' } });
    if (existingSubmission) {
       return NextResponse.json({ success: false, message: 'You already have an active submission for this assessment.', submissionId: existingSubmission._id }, { status: 400 });
    }

    const newSubmission = new UserSubmission({
      userId: new mongoose.Types.ObjectId(userId),
      assessmentId: new mongoose.Types.ObjectId(assessmentId),
      status: 'IN_PROGRESS',
    });

    await newSubmission.save();

    console.log(`New submission created: ${newSubmission._id} for user ${userId} on assessment ${assessmentId}`);

    return NextResponse.json({ success: true, message: 'Submission created successfully!', submissionId: newSubmission._id });

  } catch (error: any) {
    console.error('Create submission error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create submission.' }, { status: 500 });
  }
} 