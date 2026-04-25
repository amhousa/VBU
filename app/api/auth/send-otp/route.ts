import { NextResponse } from "next/server"
import { sendVerificationEmail } from "@/lib/email"
import { saveOtp } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Save OTP to database
    await saveOtp(email, code)

    // Send email
    if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
      console.log(`[DEV] OTP for ${email}: ${code}`)
      return NextResponse.json({ success: true, message: "OTP sent via email (dev mode)" })
    }

    const success = await sendVerificationEmail(email, code)

    if (!success) {
      console.error("Failed to send email via Resend")
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}
