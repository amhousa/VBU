"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { CustomCopyIcon } from "./custom-copy-icon"
import { CustomDownloadIcon } from "./custom-download-icon"
import { CustomTrashIcon } from "./custom-trash-icon"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { FileDocumentIcon } from "./file-document-icon"

interface FileItemProps {
  url: string
  filename: string
  onDelete: (url: string) => void
}

export function FileList({
  files,
  onDelete,
}: {
  files: { url: string; filename: string }[]
  onDelete: (url: string) => void
}) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No files uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileItem key={file.url} url={file.url} filename={file.filename} onDelete={onDelete} />
      ))}
    </div>
  )
}

function FileItem({ url, filename, onDelete }: FileItemProps) {
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
      const response = await fetch(`/api/delete?url=${encodeURIComponent(url)}`, {
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

  return (
    <Card className="file-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-nord-2 flex items-center justify-center shadow-sm">
            <FileDocumentIcon className="h-6 w-6 text-nord-8" />
          </div>
          <div className="overflow-hidden">
            <p className="font-medium truncate" title={filename}>
              {filename}
            </p>
            <p className="text-xs text-muted-foreground truncate" title={url}>
              {url.split("/").pop()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-nord-6 hover:text-nord-8 hover:bg-nord-2/50"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <CustomCopyIcon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-nord-6 hover:text-nord-8 hover:bg-nord-2/50"
            onClick={() => window.open(url, "_blank")}
          >
            <CustomDownloadIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-nord-11 hover:text-nord-11 hover:bg-nord-2/50"
          onClick={handleDelete}
        >
          <CustomTrashIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
