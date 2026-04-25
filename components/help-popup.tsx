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
          variant="link"
        >
          <Avatar className="h-8 w-8 transition-transform group-hover:scale-105">
            <AvatarFallback className="bg-primary/10 text-primary">
              <HelpCircle className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          {/* <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">Help</span> */}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-marker text-xl">
            <HelpCircle className="h-6 w-6 text-primary" />
            Vercel Blob Documentation
          </DialogTitle>
          <DialogDescription>
            Learn about Vercel Blob storage service, features, and best practices.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-96 overflow-y-auto">
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Vercel Blob is a managed, highly durable (99.999999999% reliability) object storage service tailored for frontend developers to store media assets (images, videos) at scale, supporting both public and private access with automatic CDN caching. It features simple integration with frameworks via the @vercel/blob SDK and supports file uploads up to 5TB via the dashboard or CLI.
            </p>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-marker text-lg mb-2">Key Features</h3>
              <ul className="text-sm space-y-1 text-muted-foreground/90">
                <li><strong>Storage Types:</strong> Supports public (via unique, unguessable URLs) and private (authenticated) blobs.</li>
                <li><strong>CDN Caching:</strong> Files are cached globally for up to 1 month by default.</li>
                <li><strong>Performance:</strong> Optimized for large, non-critical assets ("below the fold") using 20 regional hubs.</li>
                <li><strong>Easy Integration:</strong> Designed for Next.js and other frameworks, with support for serverless/edge environments.</li>
                <li><strong>Compatibility:</strong> Backed by AWS S3 infrastructure.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
              <FileType className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-marker text-lg mb-2">Usage and Management</h3>
              <ul className="text-sm space-y-1 text-muted-foreground/90">
                <li><strong>SDK:</strong> Use put() to upload and list() to retrieve files, with promises handling async operations.</li>
                <li><strong>CLI:</strong> Manage stores using vercel blob commands (e.g., vercel blob create-store, vercel blob put).</li>
                <li><strong>Security:</strong> Private stores require a BLOB_READ_WRITE_TOKEN and are ideal for sensitive user data.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-marker text-lg mb-2">Pricing (as of 2026)</h3>
              <ul className="text-sm space-y-1 text-muted-foreground/90">
                <li><strong>Storage:</strong> $0.023 per GB/month.</li>
                <li><strong>Data Transfer (Outbound):</strong> Starting at $0.050 per GB.</li>
                <li><strong>Free Tier (Hobby):</strong> Includes 1 GB of storage and 10 GB of data transfer per month.</li>
                <li><strong>Charges:</strong> Blob Data Transfer applies to public downloads and server fetches. Uploads via client-side have no transfer charges.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-marker text-lg mb-2">Best Practices</h3>
              <ul className="text-sm space-y-1 text-muted-foreground/90">
                <li><strong>Avoid Overwriting:</strong> By default, blobs cannot be overwritten using the same pathname.</li>
                <li><strong>Caching Large Files:</strong> Blobs up to 512 MB are cached; larger files are served from the origin.</li>
                <li><strong>Large Files:</strong> Use multipart uploads for files larger than 100 MB to improve performance.</li>
                <li><strong>Regionality:</strong> Create stores in the region closest to your users or functions to minimize latency.</li>
              </ul>
            </div>
          </div>
          <a className="underline font-marker text-lg mb-2" href="#">Vercel.com</a>
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
