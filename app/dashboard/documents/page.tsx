"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, Search, MoreHorizontal, Trash, Play, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import axios from 'axios'

const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
const maxSizeBytes = 5 * 1024 * 1024 // 5MB

interface Document {
  _id: string
  name: string
  size: number
  type: string
  uploadDate: string
  fileUrl?: string
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filter, setFilter] = useState("All")
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/documents')
      if (response.data.success) {
        setDocuments(response.data.documents)
      } else {
        setMessage(response.data.message || 'Failed to fetch documents.')
      }
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      setMessage('Error fetching documents.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
      setMessage('') // Clear previous messages
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.')
      return
    }

    // Client-side validation
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage('Invalid file type. Only PDF, DOC, DOCX, TXT are allowed.')
      setSelectedFile(null)
      return
    }

    if (selectedFile.size > maxSizeBytes) {
      setMessage('File size exceeds 5MB limit.')
      setSelectedFile(null)
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      setIsLoading(true)
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setMessage('File uploaded successfully!')
        setSelectedFile(null) // Clear selected file
        fetchDocuments() // Refresh document list
      } else {
        setMessage(response.data.message || 'Upload failed.')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setMessage('Upload failed.' + (error.response?.data?.message || ''))
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || doc.type.toLowerCase() === activeTab
    const matchesFilter = filter === "All" || doc.type === filter
    return matchesSearch && matchesTab && matchesFilter
  })

  const handleDownload = (path: string | undefined, filename: string) => {
    if (!path) {
      console.error("Download error: File URL is missing.");
      toast({
        title: "Download failed",
        description: "File cannot be downloaded because the download URL is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const link = document.createElement('a')
      link.href = path
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download started",
        description: `${filename} is being downloaded`,
        variant: "default",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the file. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Documents</CardTitle>
          <CardDescription className="text-center">Manage your learning materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 pr-4 py-2 w-full rounded-md border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <input type="file" onChange={handleFileChange} accept={allowedTypes.join(',')} />
                <button onClick={handleUpload} disabled={!selectedFile || isLoading} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">
                  {isLoading ? 'Uploading...' : 'Upload File'}
                </button>
                {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2">
              {["All", "Grammar", "Vocabulary", "Interview", "Exam Prep"].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    filter === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground bg-muted">
                <div className="col-span-5">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Date</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
              <div className="divide-y">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <motion.div
                      key={doc._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50"
                    >
                      <div className="col-span-5 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium truncate">{doc.name}</span>
                      </div>
                      <div className="col-span-2 text-sm text-muted-foreground">{(doc.size / 1024).toFixed(2)} KB</div>
                      <div className="col-span-3 text-sm text-muted-foreground">{formatDate(doc.uploadDate)}</div>
                      <div className="col-span-2 flex justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(doc.fileUrl, doc.name)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Play className="h-4 w-4 mr-2" />
                              Listen
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground">No documents found. Try changing your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 