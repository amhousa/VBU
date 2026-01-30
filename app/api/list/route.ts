import { list } from "@vercel/blob"
import { NextResponse } from "next/server"
import fileStore from "@/lib/file-store"

export async function GET(): Promise<NextResponse> {
  try {
    const { blobs } = await list()

    // Read metadata store
    const metas = await fileStore.getAllFiles()

    // Transform the data to include only what we need and merge metadata
    const files = blobs.map((blob) => {
      const pathname = blob.pathname
      const meta = metas.find((m) => m.pathname === pathname || m.url === blob.url)

      return {
        url: blob.url,
        pathname,
        filename: pathname.split("/").pop() || pathname,
        contentType: (blob as any).contentType || meta?.contentType,
        size: (blob as any).size || meta?.size,
        uploadedAt: (blob as any).uploadedAt || meta?.uploadedAt,
        category: meta?.category || pathname.split("/")[0] || null,
        ownerId: meta?.ownerId,
      }
    })

    return NextResponse.json({ files })
  } catch (error) {
    console.error("List error:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

// Required to ensure we get fresh data
export const dynamic = "force-dynamic"
