import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 })
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only JPEG, PNG, and WebP are allowed" },
        { status: 400 },
      )
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "File size should be less than 5MB" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const filename = `${uuidv4()}-${file.name.replace(/\s/g, "_")}`
    const uploadDir = path.join(process.cwd(), "public/uploads")
    const filePath = path.join(uploadDir, filename)

    // Save file
    await writeFile(filePath, buffer)

    // Return the path to the file
    const fileUrl = `/uploads/${filename}`

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        fileUrl,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

