import { NextResponse } from 'next/server';
import { UserSubmission } from '@/models/UserSubmission';
import { connectDB } from '@/lib/mongoose';
import mongoose from 'mongoose';

export async function PUT(
  request: Request,
  { params }: { params: { submissionId: string } }
) {
  try {
    await connectDB();

    const { submissionId } = params;
    const updateData = await request.json();

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid submission ID format.' },
        { status: 400 }
      );
    }

    const updatedSubmission = await UserSubmission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { success: false, message: 'Submission not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Submission updated successfully!', submission: updatedSubmission });

  } catch (error: any) {
    console.error('Update submission error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update submission.' },
      { status: 500 }
    );
  }
} 