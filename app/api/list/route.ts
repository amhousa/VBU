import { list } from "@vercel/blob"
import { NextResponse } from "next/server"
import fileStore from "@/lib/file-store"
import { validateToken } from "@/lib/auth"

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // Get token from header or query parameter
    const token = request.headers.get("x-vbu-token") || new URL(request.url).searchParams.get("token")
    
    // Validate token and get user email
    const { isValid, email } = await validateToken(token)

    const { blobs } = await list()

    // Read metadata store
    const metas = await fileStore.getAllFiles()

    // Transform the data to include only what we need and merge metadata
    const files = blobs
      .map((blob) => {
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
          access: meta?.access,
        }
      })
      .filter((file) => {
        // If user is authenticated, show their private files + all public files
        if (isValid && email) {
          return file.access === "public" || file.ownerId === email
        }
        // If user is not authenticated, show only public files
        return file.access === "public"
      })

    return NextResponse.json({ files })
  } catch (error) {
    console.error("List error:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

// Required to ensure we get fresh data
export const dynamic = "force-dynamic"
