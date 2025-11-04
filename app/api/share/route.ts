import { NextResponse } from "next/server"

// Share API removed — uploads are public links. Keep a safe stub to avoid 500s.
export async function GET() {
  return NextResponse.json({ error: "Share API removed. Files are public links." }, { status: 410 })
}

export async function POST() {
  return NextResponse.json({ error: "Share API removed. Files are public links." }, { status: 410 })
}

export const dynamic = "force-dynamic"
