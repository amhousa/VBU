"use client"

import { useState } from "react"
import { FileType, Upload, AlertCircle } from "lucide-react"
import { HelpDocumentIcon } from "./help-document-icon"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function HelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-nord-6 hover:text-nord-8 hover:bg-nord-2/50"
        onClick={() => setOpen(true)}
        aria-label="Help information"
      >
        <HelpDocumentIcon className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-nord-0 border-nord-3">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-nord-6 font-marker">
              <HelpDocumentIcon className="h-5 w-5 text-nord-8" />
              Upload Help Information
            </DialogTitle>
            <DialogDescription className="text-nord-4">
              Learn about file uploads, formats, and size limits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-nord-4">
            <div className="flex items-start gap-3">
              <div className="bg-nord-2 p-2 rounded-md">
                <Upload className="h-5 w-5 text-nord-8" />
              </div>
              <div>
                <h3 className="font-marker text-nord-6 mb-1">How to Upload</h3>
                <p className="text-sm">
                  Drag and drop files directly into the upload area, or click the "Browse Files" button to select files
                  from your device.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-nord-2 p-2 rounded-md">
                <FileType className="h-5 w-5 text-nord-8" />
              </div>
              <div>
                <h3 className="font-marker text-nord-6 mb-1">Supported Formats</h3>
                <p className="text-sm">We support a wide range of file formats, including:</p>
                <ul className="text-sm mt-1 space-y-1 list-disc list-inside">
                  <li>Images: JPG, PNG, GIF, SVG, WebP</li>
                  <li>Documents: PDF, DOCX, XLSX, PPTX, TXT</li>
                  <li>Media: MP4, MP3, WAV</li>
                  <li>Archives: ZIP, RAR</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-nord-2 p-2 rounded-md">
                <AlertCircle className="h-5 w-5 text-nord-8" />
              </div>
              <div>
                <h3 className="font-marker text-nord-6 mb-1">Size Limits</h3>
                <p className="text-sm">
                  Maximum file size: <span className="font-medium">4 MB</span> per file.
                </p>
                <p className="text-sm mt-1">
                  For larger files, please contact support or consider compressing your files before uploading.
                </p>
              </div>
            </div>
          </div>
          <Button className="bg-nord-8 hover:bg-nord-7 text-nord-0" onClick={() => setOpen(false)}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
