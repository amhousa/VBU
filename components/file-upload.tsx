"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { DocumentAttachmentIcon } from "./document-attachment-icon"
import { FileTextIcon } from "./file-text-icon"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onUploadComplete: (url: string, filename: string) => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // visibility removed — all uploads produce public links
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

  const params = new URLSearchParams()
  params.set("filename", selectedFile.name)

      const response = await fetch(`/api/upload?${params.toString()}`, {
        method: "POST",
        body: selectedFile,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setUploadProgress(100)

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully.",
      })

      onUploadComplete(data.url, selectedFile.name)
      setSelectedFile(null)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 relative overflow-hidden bg-transparent backdrop-blur-sm">
        <div
          className={`file-drop-area ${isDragging ? "active" : ""} relative z-10`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4 shadow-sm">
                <DocumentAttachmentIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-marker mb-2">Drag and drop your file here</h3>
              <p className="text-muted-foreground mb-4">or click to browse from your computer</p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-4">
                <FileTextIcon className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>

                      {/* Visibility removed — uploads are public links */}

              {isUploading ? (
                <div className="w-full max-w-md">
                  <Progress value={uploadProgress} className="h-2 mb-2" />
                  <p className="text-sm text-center text-muted-foreground">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleUpload}>
                    Upload File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
