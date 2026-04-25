import { del } from "@vercel/blob"
import { NextResponse } from "next/server"
import fileStore from "@/lib/file-store"
import { validateToken } from "@/lib/auth"

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  const token = request.headers.get("x-vbu-token") || searchParams.get("token")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    // Get the file metadata
    const meta = await fileStore.findFileByPath(url)
    
    if (!meta) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Validate token and get user email
    const { isValid, email } = await validateToken(token)

    // Check permissions: can only delete own private files or public files can be deleted by anyone
    if (meta.access === "private") {
      if (!isValid || email !== meta.ownerId) {
        return NextResponse.json({ error: "Unauthorized: You can only delete your own files" }, { status: 403 })
      }
    }

    // Delete from Vercel Blob
    await del(url)

    // Remove metadata
    await fileStore.removeFileByPath(url, email || undefined)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
