import { NextResponse } from "next/server"
import fileStore from "@/lib/file-store"

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Public links: return the blob URL. Note: private blobs would require signed URLs.
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Failed to prepare download" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
