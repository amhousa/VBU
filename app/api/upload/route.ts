import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get("filename") || "file"

  try {
    // Generate a unique filename to avoid collisions
    const uniqueFilename = `${Date.now()}-${filename}`

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, request.body, {
      access: "public",
    })

    // Return the blob URL and other metadata
    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: blob.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

// Required for streaming responses
export const dynamic = "force-dynamic"
