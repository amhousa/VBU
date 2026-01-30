"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"
import { CodeTerminal } from "@/components/code-terminal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { CloudUploadIcon } from "@/components/cloud-upload-icon"
import { CloudDownloadIcon } from "@/components/cloud-download-icon"
import { ProcessorIcon } from "@/components/processor-icon"
import { CodeTagIcon } from "@/components/code-tag-icon"
import { HelpButton } from "@/components/help-popup"
import { PageSkeleton } from "@/components/skeletons"
import { useView } from "@/components/ui/view-provider"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FileInfo {
  url: string
  filename: string
  visibility?: string
  category?: string
  shared?: boolean
}

export default function Home() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null)
  const [isYourFilesOpen, setIsYourFilesOpen] = useState(true)
  const { showAstronaut } = useView()

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/list")
      const data = await response.json()

      if (data.files) {
        setFiles(
          data.files.map((file: any) => ({
            url: file.url,
            filename: file.filename,
            visibility: file.visibility,
            category: file.category,
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadComplete = (url: string, filename: string) => {
    fetchFiles()
    setSelectedFile({ url, filename })
  }

  const handleDelete = (url: string) => {
    setFiles((prev) => prev.filter((file) => file.url !== url))
    if (selectedFile?.url === url) {
      setSelectedFile(null)
    }
  }

  const getHtmlCode = (url: string) => `<img src="${url}" alt="Uploaded image" />`
  const getMarkdownCode = (url: string) => `![Uploaded image](${url})`
  const getNextJsCode = (url: string) => `import Image from 'next/image';\n\nexport default function MyComponent() {\n  return (\n    <Image\n      src="${url}"\n      alt="Uploaded image"\n      width={500}\n      height={300}\n      layout="responsive"\n    />\n  );\n}`

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-300", showAstronaut ? "bg-transparent" : "bg-background")}>
      <div className="page-overlay"></div>
      <Header />
      <main className="flex-1 container py-8">
        {isLoading ? (
          <PageSkeleton />
        ) : (
          <div className="grid gap-8">
            <section className="bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-marker flex items-center gap-2 text-foreground">
                  <CloudUploadIcon className="h-6 w-6 text-primary" />
                  <span>Upload Files</span>
                </h2>
                <HelpButton />
              </div>
              <FileUpload onUploadComplete={handleUploadComplete} />
            </section>

            <Collapsible
              open={isYourFilesOpen}
              onOpenChange={setIsYourFilesOpen}
              className="bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-marker flex items-center gap-2 text-foreground">
                  <CloudDownloadIcon className="h-6 w-6 text-primary" />
                  <span>Your Files</span>
                </h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isYourFilesOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-6">
                <FileList files={files} onDelete={handleDelete} />
              </CollapsibleContent>
            </Collapsible>

            {selectedFile && (
              <section className="bg-card/40 backdrop-blur-md border border-border/40 rounded-3xl p-6 shadow-sm">
                <h2 className="text-2xl font-marker mb-6 flex items-center gap-2 text-foreground">
                  <CodeTagIcon className="h-6 w-6 text-primary" />
                  <span>Usage Examples</span>
                </h2>
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="mb-4 w-full justify-start bg-muted/40 backdrop-blur-sm p-1 rounded-full h-auto">
                    <TabsTrigger 
                      value="html" 
                      className="rounded-full px-4 py-2 data-[state=active]:bg-background/80 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-sm transition-all"
                    >
                      HTML
                    </TabsTrigger>
                    <TabsTrigger 
                      value="markdown" 
                      className="rounded-full px-4 py-2 data-[state=active]:bg-background/80 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-sm transition-all"
                    >
                      Markdown
                    </TabsTrigger>
                    <TabsTrigger 
                      value="nextjs" 
                      className="rounded-full px-4 py-2 data-[state=active]:bg-background/80 data-[state=active]:backdrop-blur-sm data-[state=active]:shadow-sm transition-all"
                    >
                      Next.js
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="html" className="mt-0">
                    <CodeTerminal title="HTML" code={getHtmlCode(selectedFile.url)} />
                  </TabsContent>
                  <TabsContent value="markdown" className="mt-0">
                    <CodeTerminal title="Markdown" code={getMarkdownCode(selectedFile.url)} />
                  </TabsContent>
                  <TabsContent value="nextjs" className="mt-0">
                    <CodeTerminal title="Next.js" code={getNextJsCode(selectedFile.url)} />
                  </TabsContent>
                </Tabs>
              </section>
            )}
          </div>
        )}
      </main>
      <footer className="border-t border-border/40 py-8 bg-background/40 backdrop-blur-md mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 mb-2">
            <ProcessorIcon className="h-4 w-4 text-primary" />
            <span className="font-marker text-foreground">Vercel Blob upload</span>
            <span>- Built with Next.js and Vercel Blob</span>
          </p>
          <p>
            Powered By{" "}
            <a
              href="https://amirsalmani.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Amirhossin Salmani
            </a>
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  )
}
