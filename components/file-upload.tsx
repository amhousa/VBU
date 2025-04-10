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

      const response = await fetch(`/api/upload?filename=${encodeURIComponent(selectedFile.name)}`, {
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
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20">
          <svg width="300" height="300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 10V14M7.44712 3.42103C8.73941 2.52503 10.3084 2 12 2C16.4183 2 20 5.58172 20 10V11.2367M4.41632 7.44607C4.14633 8.24809 4 9.10696 4 10V14C4 17.6349 6.42416 20.7035 9.74396 21.6775M19.6588 16.3187C18.9294 18.7314 17.0911 20.6626 14.7367 21.5196M14.325 6.14635C13.6464 5.7361 12.8508 5.5 12 5.5C9.51472 5.5 7.5 7.51472 7.5 10V12.95M16.5 11.04V14C16.5 16.4853 14.4853 18.5 12 18.5C11.1514 18.5 10.3576 18.2651 9.68014 17.8567"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          className={`file-drop-area ${isDragging ? "active" : ""} relative z-10`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-lg bg-nord-2 flex items-center justify-center mb-4 shadow-sm">
                <DocumentAttachmentIcon className="h-8 w-8 text-nord-8" />
              </div>
              <h3 className="text-lg font-marker mb-2">Drag and drop your file here</h3>
              <p className="text-muted-foreground mb-4">or click to browse from your computer</p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="bg-nord-0/70 hover:bg-nord-2/70 text-nord-6 border-nord-3"
              >
                Browse Files
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-4">
                <FileTextIcon className="h-8 w-8 text-nord-8" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>

              {isUploading ? (
                <div className="w-full max-w-md">
                  <Progress value={uploadProgress} className="h-2 mb-2" />
                  <p className="text-sm text-center text-muted-foreground">Uploading... {uploadProgress}%</p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleUpload} className="bg-nord-8 hover:bg-nord-7 text-nord-0">
                    Upload File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="bg-nord-0/70 hover:bg-nord-2/70 text-nord-6 border-nord-3"
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
