"use client"

import { useState } from "react"
import { Check, Copy, Download, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { FileDocumentIcon } from "./file-document-icon"
import { useView } from "./ui/view-provider"
import Image from "next/image"

function isImage(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return ['png','jpg','jpeg','gif','webp','avif','svg'].includes(ext)
}

interface FileItemProps {
  url: string
  filename: string
  onDelete: (url: string) => void
}

export function FileList({
  files,
  onDelete,
}: {
  files: { url: string; filename: string; category?: string }[]
  onDelete: (url: string) => void
}) {
  const { mode } = useView()

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No files uploaded yet</p>
      </div>
    )
  }

  if (mode === 'list') {
    return (
      <div className="flex flex-col divide-y divide-border">
        {files.map((file) => (
          <div key={file.url} className="py-3">
            <FileItem url={file.url} filename={file.filename} onDelete={onDelete} category={file.category} />
          </div>
        ))}
      </div>
    )
  }

  // grid or compact
  const cols = mode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <div className={`grid gap-4 ${cols}`}>
      {files.map((file) => (
        <FileItem key={file.url} url={file.url} filename={file.filename} onDelete={onDelete} category={file.category} />
      ))}
    </div>
  )
}
        function FileItem({ url, filename, onDelete, visibility, category, shared }: FileItemProps & { visibility?: string; category?: string; shared?: boolean }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "URL copied",
        description: "The file URL has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDelete = async () => {
    try {
      let deleteUrl = `/api/delete?url=${encodeURIComponent(url)}`
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      onDelete(url)
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully.",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting your file.",
        variant: "destructive",
      })
    }
  }
  const { mode } = useView()

  const image = isImage(filename)
  const thumbSize = mode === 'compact' ? 28 : 80

  return (
    <Card className={`file-card ${mode === 'compact' ? 'p-2' : ''} overflow-hidden`}>
      <CardContent className={`p-4 ${mode === 'compact' ? 'py-2 px-3' : ''}`}>
        <div className={`flex items-center gap-3 ${mode === 'list' ? 'justify-between' : ''}`}>
          <div className={`flex items-center gap-3 ${mode === 'list' ? 'flex-1 min-w-0' : 'min-w-0 flex-1'}`}>
            <div className={`rounded-lg bg-muted flex items-center justify-center shadow-sm overflow-hidden relative shrink-0`} style={{ width: thumbSize, height: thumbSize }}>
              {image ? (
                <Image 
                  src={url} 
                  alt={filename} 
                  fill
                  className="object-cover"
                  sizes={`${thumbSize}px`}
                  loading="lazy"
                />
              ) : (
                <FileDocumentIcon className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className={`overflow-hidden flex-1 ${mode === 'compact' ? 'text-sm' : ''}`}>
              <p className={`font-medium truncate ${mode === 'compact' ? 'text-sm' : ''} text-foreground`} title={filename}>
                {filename}
              </p>
              {mode !== 'compact' && (
                <p className="text-xs text-muted-foreground truncate" title={url}>
                  {url.split("/").pop()}
                </p>
              )}
            </div>
          </div>

          {mode === 'list' && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={async () => {
                  try {
                    window.open(url, "_blank")
                  } catch (err) {
                    console.error("Download error:", err)
                    toast({ title: "Download failed", description: "Could not fetch file.", variant: "destructive" })
                  }
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {mode !== 'list' && (
        <CardFooter className="p-2 pt-0 flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={async () => {
                try {
                  window.open(url, "_blank")
                } catch (err) {
                  console.error("Download error:", err)
                  toast({ title: "Download failed", description: "Could not fetch file.", variant: "destructive" })
                }
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
