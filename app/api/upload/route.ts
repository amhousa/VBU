import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import fileStore from "@/lib/file-store"
import virusScan from "@/lib/virus-scan"
import { validateToken } from "@/lib/auth"

function categoryFromFilename(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  const imageExt = ["png", "jpg", "jpeg", "gif", "webp", "avif", "svg"]
  const videoExt = ["mp4", "mov", "webm", "mkv"]
  const audioExt = ["mp3", "wav", "m4a", "flac"]
  const docExt = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "md"]
  const archiveExt = ["zip", "rar", "7z", "tar", "gz"]

  if (imageExt.includes(ext)) return "images"
  if (videoExt.includes(ext)) return "videos"
  if (audioExt.includes(ext)) return "audio"
  if (docExt.includes(ext)) return "documents"
  if (archiveExt.includes(ext)) return "archives"
  if (ext) return ext
  return "others"
}

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename") || "file"
  const token = request.headers.get("x-vbu-token") || searchParams.get("token")

  try {
    // Read the request body
    const buffer = await request.arrayBuffer()
    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 })
    }

    // Validate token and get user email
    const { isValid, email } = await validateToken(token)
    
    // Determine access level: private for authenticated users, public for guests
    const access: "private" | "public" = isValid ? "private" : "public"
    const ownerId = isValid && email ? email : "guest"

    const category = categoryFromFilename(filename)

    // Generate a unique filename under category folder to avoid collisions
    // For authenticated users, use a safe identifier instead of email (which contains special chars)
    const safeEmail = isValid && email ? email.replace(/[^a-z0-9._-]/gi, "_") : null
    const uniqueFilename = safeEmail
      ? `${safeEmail}/${category}/${Date.now()}-${filename}`
      : `public/${category}/${Date.now()}-${filename}`

    console.log("Uploading file:", { filename, access, ownerId, uniqueFilename })

    // Upload to Vercel Blob with appropriate access level
    // Note: Vercel Blob only supports public URLs. Access control is managed at the API level.
    const blob = await put(uniqueFilename, buffer, { access: "public" })

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    const meta = {
      id,
      url: blob.url,
      pathname: blob.pathname,
      filename,
      contentType: (blob as any).contentType,
      size: (blob as any).size,
      uploadedAt: (blob as any).uploadedAt || new Date().toISOString(),
      category,
      access,
      ownerId,
    }

    // Persist metadata in local JSON store
    await fileStore.addFile(meta)

    // After upload: attempt to download the blob and scan it. If infected, delete the blob and
    // remove metadata, then return an error to the client. This is a best-effort scan and relies
    // on an installed ClamAV + 'clamscan' npm package. If the scanner is not available the scan is skipped.
    try {
      const res = await fetch(blob.url)
      if (res.ok) {
        const buffer = await res.arrayBuffer()
        const scan = await virusScan.scanBufferToTempAndScan(buffer)
        if (!scan.ok) {
          console.warn("Scan failed or skipped:", scan)
        }
        if (scan.infected) {
          // remove blob and metadata
          try {
            await import("@vercel/blob").then((m) => m.del(blob.url))
          } catch (err) {
            console.error("Failed to delete infected blob:", err)
          }
          await fileStore.removeFileByPath(blob.pathname)
          return NextResponse.json({ error: "File detected as infected and was removed" }, { status: 400 })
        }
      }
    } catch (err) {
      console.warn("Post-upload scan failed:", err)
    }

    // Return the blob URL and other metadata
    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: (blob as any).contentType,
      size: (blob as any).size,
      category,
      access,
    })
  } catch (error) {
    console.error("Upload error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Error details:", errorMessage)
    return NextResponse.json({ error: "Failed to upload file", details: errorMessage }, { status: 500 })
  }
}

// Required for streaming responses
export const dynamic = "force-dynamic"
