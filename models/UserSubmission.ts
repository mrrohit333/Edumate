import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

const userSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  answers: [answerSchema],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'SUBMITTED', 'TERMINATED'],
    default: 'IN_PROGRESS'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one submission per user per assessment
userSubmissionSchema.index({ userId: 1, assessmentId: 1 }, { unique: true });

export const UserSubmission = mongoose.models.UserSubmission || mongoose.model('UserSubmission', userSubmissionSchema); 