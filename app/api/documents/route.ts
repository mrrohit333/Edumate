import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Define a schema for your documents (must match the one in upload/route.ts)
const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }, // Date of upload
  filePath: { type: String, required: true }, // Include filePath from upload schema
});

// Create a model based on the schema (must match the one in upload/route.ts)
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

export async function GET() {
  try {
    await connectDB(); // Ensure database connection

    // Fetch all documents from the database, including the filePath
    const documents = await Document.find({}).sort({ uploadDate: -1 });

    console.log(`Fetched ${documents.length} documents from MongoDB.`);

    // Map documents to include the fileUrl for the frontend
    const documentsWithFileUrl = documents.map(doc => ({
      _id: doc._id,
      name: doc.name,
      size: doc.size,
      type: doc.type,
      uploadDate: doc.uploadDate,
      fileUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}${doc.filePath}` // Make URL absolute
    }));

    return NextResponse.json({ success: true, documents: documentsWithFileUrl });

  } catch (error: any) {
    console.error('Fetch documents error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to fetch documents.' }, { status: 500 });
  }
} 