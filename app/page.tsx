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
    // Refresh list to pick up category/protection metadata
    fetchFiles()
    setSelectedFile({ url, filename })
  }

  const handleDelete = (url: string) => {
    setFiles((prev) => prev.filter((file) => file.url !== url))
    if (selectedFile?.url === url) {
      setSelectedFile(null)
    }
  }

  const getHtmlCode = (url: string) => {
    return `<img src="${url}" alt="Uploaded image" />`
  }

  const getMarkdownCode = (url: string) => {
    return `![Uploaded image](${url})`
  }

  const getNextJsCode = (url: string) => {
    return `import Image from 'next/image';\n\nexport default function MyComponent() {\n  return (\n    <Image\n      src="${url}"\n      alt="Uploaded image"\n      width={500}\n      height={300}\n      layout="responsive"\n    />\n  );\n}`
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="page-overlay"></div>
      <Header />
      <main className="flex-1 container py-8">
        <div className="grid gap-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-marker flex items-center gap-2">
                <CloudUploadIcon className="h-5 w-5 text-nord-8" />
                <span>Upload Files</span>
              </h2>
              <HelpButton />
            </div>
            <FileUpload onUploadComplete={handleUploadComplete} />
          </section>

          <section>
            <h2 className="text-2xl font-marker mb-4 flex items-center gap-2">
              <CloudDownloadIcon className="h-5 w-5 text-nord-8" />
              <span>Your Files</span>
            </h2>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading files...</p>
              </div>
            ) : (
              <FileList files={files} onDelete={handleDelete} />
            )}
          </section>

          {selectedFile && (
            <section>
              <h2 className="text-2xl font-marker mb-4 flex items-center gap-2">
                <CodeTagIcon className="h-5 w-5 text-nord-8" />
                <span>Usage Examples</span>
              </h2>
              <Tabs defaultValue="html">
                <TabsList className="mb-4">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  <TabsTrigger value="nextjs">Next.js</TabsTrigger>
                </TabsList>
                <TabsContent value="html">
                  <CodeTerminal title="HTML" code={getHtmlCode(selectedFile.url)} />
                </TabsContent>
                <TabsContent value="markdown">
                  <CodeTerminal title="Markdown" code={getMarkdownCode(selectedFile.url)} />
                </TabsContent>
                <TabsContent value="nextjs">
                  <CodeTerminal title="Next.js" code={getNextJsCode(selectedFile.url)} />
                </TabsContent>
              </Tabs>
            </section>
          )}
        </div>
      </main>
      <footer className="border-t border-nord-3/50 py-6 backdrop-blur-sm bg-nord-0/70">
        <div className="container text-center text-sm text-nord-4">
          <p className="flex items-center justify-center gap-2">
            <ProcessorIcon className="h-4 w-4 text-nord-8" />
            <span className="font-marker">Vercel Blob upload</span> - Built with Next.js and Vercel Blob
          </p>
          <p className="mt-2">
            Powered By{" "}
            <a
              href="https://amirsalmani.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nord-8 hover:underline"
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
