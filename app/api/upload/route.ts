import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile } from 'fs/promises';
import mongoose from 'mongoose'
import { join } from 'path'

// Define a schema for your documents
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }, // Date of upload
  filePath: { type: String, required: true } // Added filePath to store the file location
});

// Create a model based on the schema
const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);

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

export const config = {
  api: {
    // Explicitly set a size limit for the request body and disable built-in body parser
    bodyParser: {
      sizeLimit: '10mb',
      enabled: false, // Explicitly disable
    },
    responseLimit: '10mb', // Increase response limit, though less likely the issue for uploads
  },
};

export async function POST(request: Request) {
  try {
    await connectDB(); // Ensure database connection

    const formData = await request.formData();
    const file: File | null = formData.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    // Basic server-side validation (type and size)
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Invalid file type.' }, { status: 400 });
    }

    if (file.size > maxSizeBytes) {
      return NextResponse.json({ success: false, message: 'File size exceeds 5MB limit.' }, { status: 400 });
    }

    // Generate a unique filename to avoid conflicts
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}-${uniqueSuffix}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, filename);
    const relativeFilePath = join('/uploads', filename); // Path accessible from the browser

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file to the server's public directory
    await writeFile(filePath, buffer);
    console.log(`File saved to ${filePath}`);

    // Create a new document instance including the file path
    const newDocument = new Document({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      filePath: relativeFilePath // Store the relative path
    });

    // Save the document metadata to the database
    await newDocument.save();

    console.log(`Document metadata saved to MongoDB: ${file.name}`);

    return NextResponse.json({ success: true, message: 'File uploaded successfully!' });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Upload failed.' }, { status: 500 });
  }
} 