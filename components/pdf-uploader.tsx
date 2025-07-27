"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, File, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PDFUploaderProps {
  onUpload: (file: File) => void
}

export default function PDFUploader({ onUpload }: PDFUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (selectedFile: File | undefined) => {
    setError(null)

    if (!selectedFile) {
      return
    }

    // Define allowed file types and their MIME types
    const allowedTypes = [
      { extension: '.pdf', mime: 'application/pdf' },
      { extension: '.ppt', mime: 'application/vnd.ms-powerpoint' },
      { extension: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
      { extension: '.doc', mime: 'application/msword' },
      { extension: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { extension: '.txt', mime: 'text/plain' },
      { extension: '.csv', mime: 'text/csv' },
    ];

    const fileType = selectedFile.type;
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

    const isAllowedType = allowedTypes.some(type => type.mime === fileType || (fileExtension && type.extension === `.${fileExtension}`));

    if (!isAllowedType) {
      setError("Please upload a PDF, PPT, DOCX, TXT, or CSV file")
      return
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB")
      return
    }

    setFile(selectedFile)

    // Automatically trigger upload after setting the file
    handleUpload();
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    validateAndSetFile(droppedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    try {
      // Call the onUpload callback
      onUpload(file)

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.")
    } finally {
      setUploading(false)
      setFile(null)
    }
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Keep the hidden file input */}
      <Input
        ref={fileInputRef}
        id="pdf-upload"
        type="file"
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Add a single button to trigger the file input */}
      <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </>
        )}
      </Button>
    </div>
  )
}

