"use client"

import { useState } from "react"
import { FileType, Upload, AlertCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function HelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-full border-border/40 pl-1 pr-4 h-10 gap-3 hover:bg-accent/50 transition-all shadow-sm group"
        >
          <Avatar className="h-8 w-8 transition-transform group-hover:scale-105">
            <AvatarFallback className="bg-primary/10 text-primary">
              <HelpCircle className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-marker text-xl">
            <HelpCircle className="h-6 w-6 text-primary" />
            Upload Help Information
          </DialogTitle>
          <DialogDescription>
            Learn about file uploads, formats, and size limits.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-marker text-lg mb-1">How to Upload</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Drag and drop files directly into the upload area, or click the "Browse Files" button to select files
                from your device.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
              <FileType className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-marker text-lg mb-1">Supported Formats</h3>
              <p className="text-sm text-muted-foreground mb-2">We support a wide range of file formats, including:</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground/90 pl-1">
                <li>Images: JPG, PNG, GIF, SVG, WebP</li>
                <li>Documents: PDF, DOCX, XLSX, PPTX, TXT</li>
                <li>Media: MP4, MP3, WAV</li>
                <li>Archives: ZIP, RAR</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-marker text-lg mb-1">Size Limits</h3>
              <p className="text-sm text-muted-foreground">
                Maximum file size: <span className="font-bold text-foreground">4 MB</span> per file.
              </p>
              <p className="text-xs mt-1.5 text-muted-foreground/80">
                For larger files, please contact support or consider compressing your files before uploading.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={() => setOpen(false)} className="px-6">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
