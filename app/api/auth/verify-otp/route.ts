import { NextResponse } from "next/server"
import { verifyOtp, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    // Special backdoor for demo/testing if needed (remove in production)
    if (code === "000000" && process.env.NODE_ENV === 'development') {
      const token = await createSession(email)
      return NextResponse.json({ success: true, token, email })
    }

    const isValid = await verifyOtp(email, code)

    if (isValid) {
      const token = await createSession(email)
      return NextResponse.json({ success: true, token, email })
    } else {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
    }
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
