import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Get the form data
    const formData = await request.formData()
    const file = formData.get("image") as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      )
    }

    // Get file extension
    const ext = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${ext}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("profile-images")
      .upload(fileName, file)

    if (uploadError) {
      console.error("Error uploading to storage:", uploadError)
      return NextResponse.json(
        { success: false, message: "Failed to upload image" },
        { status: 500 }
      )
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from("profile-images")
      .getPublicUrl(fileName)

    // Get user from session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: publicUrl },
    })

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error in upload-image route:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
} 