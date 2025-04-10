import { list } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
  try {
    const { blobs } = await list()

    // Transform the data to include only what we need
    const files = blobs.map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      filename: blob.pathname.split("/").pop() || blob.pathname,
      contentType: blob.contentType,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }))

    return NextResponse.json({ files })
  } catch (error) {
    console.error("List error:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

// Required to ensure we get fresh data
export const dynamic = "force-dynamic"
