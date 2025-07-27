import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const API_KEY = process.env.EDUMATE_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: "EDUMATE_API_KEY not configured" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    const formData = await request.formData();
    const message = formData.get('message') as string | null;
    const file = formData.get('file') as File | null;

    if (!message && !file) {
        return NextResponse.json({ error: "Message or file not provided" }, { status: 400 });
    }

    let promptText = message || "";
    const imageParts: { inlineData: { data: string, mimeType: string } }[] = [];

    if (file) {
      // Basic file type check (you might want more robust validation)
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/') && file.type !== 'application/pdf') {
           return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
      }

      // For images, convert to base64 for inline data (Gemini supports this)
      // For other types, you might need different handling or upload to storage
      if (file.type.startsWith('image/')) {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');
        imageParts.push({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      } else {
         // Handle other file types (e.g., PDF, video) - this will require different Gemini API approaches
         // For now, we'll just add a note to the prompt if a non-image file is uploaded
         promptText += `\n\nAnalysis of uploaded file: ${file.name} (${file.type})`;
         // You would need to implement logic here to read and potentially summarize/process the document/video
         // For PDF, you might use a library to extract text.
         // For video, you might need to use a video processing API or extract key frames.
         // The Gemini API supports video input directly in some models, refer to their docs.
      }
    }

    const parts: (string | { inlineData: { data: string, mimeType: string } })[] = [promptText, ...imageParts];

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Error generating response from Gemini API" }, { status: 500 });
  }
} 