import mongoose, { Document, Schema } from 'mongoose';
import { getModel } from '../lib/mongoose'; // Import getModel helper

export interface IAnswer {
  questionId: Schema.Types.ObjectId; // Reference to the question within the assessment
  answer: string | string[] | boolean; // The user's provided answer
}

export interface IAssessmentResult extends Document {
  assessment: Schema.Types.ObjectId; // Reference to the Assessment
  user?: Schema.Types.ObjectId; // Reference to the User (assuming a User model exists)
  answers: IAnswer[];
  score?: number; // Calculated score
  startTime: Date;
  endTime?: Date; // End time, will be set when submitted or terminated
  terminated?: boolean; // Flag if the assessment was terminated
  terminationReason?: string; // Reason for termination (e.g., tab switch)
  createdAt: Date;
}

const AnswerSchema: Schema = new Schema({
  questionId: { type: Schema.Types.ObjectId, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
}, { _id: false }); // Prevent Mongoose from creating _id for subdocuments

const AssessmentResultSchema: Schema = new Schema({
  assessment: { type: Schema.Types.ObjectId, required: true, ref: 'Assessment' },
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to a User model
  answers: { type: [AnswerSchema], required: true },
  score: { type: Number },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  terminated: { type: Boolean, default: false },
  terminationReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Use getModel to retrieve the AssessmentResult model, preventing redefinition
const AssessmentResult = getModel<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);

export default AssessmentResult; 