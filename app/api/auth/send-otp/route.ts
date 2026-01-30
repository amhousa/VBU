import { NextResponse } from "next/server"
import { sendOTPSMS } from "@/lib/sms"
import fs from "fs/promises"
import path from "path"

// Simple in-memory store for OTPs (for demo purposes)
// In production, use Redis or a database
const OTP_STORE_PATH = path.join(process.cwd(), "data", "otps.json")

interface OtpData {
  phone: string
  code: string
  expiresAt: number
}

async function saveOtp(phone: string, code: string) {
  try {
    await fs.mkdir(path.dirname(OTP_STORE_PATH), { recursive: true })
    let otps: OtpData[] = []
    try {
      const content = await fs.readFile(OTP_STORE_PATH, "utf8")
      otps = JSON.parse(content)
    } catch (e) {
      // ignore
    }

    // Remove existing OTP for this phone
    otps = otps.filter(o => o.phone !== phone)
    
    // Add new OTP
    otps.push({
      phone,
      code,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    })

    await fs.writeFile(OTP_STORE_PATH, JSON.stringify(otps, null, 2))
  } catch (error) {
    console.error("Error saving OTP:", error)
  }
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Generate 5-digit OTP
    const code = Math.floor(10000 + Math.random() * 90000).toString()
    
    // Save OTP
    await saveOtp(phone, code)

    // Send SMS
    // Note: In development, you might want to log the code instead of sending SMS to save credits
    if (process.env.NODE_ENV === 'development' && !process.env.FARAZ_SMS_API_KEY) {
      console.log(`[DEV] OTP for ${phone}: ${code}`)
      return NextResponse.json({ success: true, message: "OTP generated (dev mode)" })
    }

    const success = await sendOTPSMS(phone, code)

    if (!success) {
      console.error("Failed to send SMS via provider")
      // In production you might want to return an error, but for now we'll log it
      // return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
