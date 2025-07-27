import mongoose, { Document, Schema } from 'mongoose';
import { getModel } from '../lib/mongoose'; // Import getModel helper

export interface IQuestion {
  _id: string;
  type: 'mcq' | 'msq' | 'true_false' | 'coding';
  text: string;
  options?: string[]; // For MCQ, MSQ
  correctAnswer: string | string[] | boolean; // Adjust type based on question type
  codeTemplate?: string; // For coding questions
}

export interface IAssessment extends Document {
  title: string;
  password?: string; // Optional password, can be required for taking
  startTime: Date;
  endTime: Date;
  timer: number; // Add timer field (in minutes)
  questions: IQuestion[];
  createdAt: Date;
}

const QuestionSchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['mcq', 'msq', 'true_false', 'coding'] },
  text: { type: String, required: true },
  options: { type: [String] },
  correctAnswer: { type: Schema.Types.Mixed, required: true }, // Use Mixed for flexibility
  codeTemplate: { type: String },
});

const AssessmentSchema: Schema = new Schema({
  title: { type: String, required: true },
  password: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  timer: { type: Number }, // Add timer field (in minutes)
  questions: { type: [QuestionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Use getModel to retrieve the Assessment model, preventing redefinition
const Assessment = getModel('Assessment', AssessmentSchema);

export default Assessment; 