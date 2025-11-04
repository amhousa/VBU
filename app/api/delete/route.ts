import { del } from "@vercel/blob"
import { NextResponse } from "next/server"
import fileStore from "@/lib/file-store"

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    const meta = await fileStore.findFileByPath(url)
    await del(url)

    // Remove metadata if present
    await fileStore.removeFileByPath(url)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
