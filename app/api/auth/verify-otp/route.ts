import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const OTP_STORE_PATH = path.join(process.cwd(), "data", "otps.json")

interface OtpData {
  phone: string
  code: string
  expiresAt: number
}

async function verifyOtp(phone: string, code: string): Promise<boolean> {
  try {
    const content = await fs.readFile(OTP_STORE_PATH, "utf8")
    let otps: OtpData[] = JSON.parse(content)
    
    const otpIndex = otps.findIndex(o => o.phone === phone && o.code === code)
    
    if (otpIndex === -1) return false
    
    const otp = otps[otpIndex]
    
    // Check expiration
    if (Date.now() > otp.expiresAt) {
      // Clean up expired
      otps.splice(otpIndex, 1)
      await fs.writeFile(OTP_STORE_PATH, JSON.stringify(otps, null, 2))
      return false
    }

    // Valid OTP - remove it (single use)
    otps.splice(otpIndex, 1)
    await fs.writeFile(OTP_STORE_PATH, JSON.stringify(otps, null, 2))
    
    return true
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json({ error: "Phone and code are required" }, { status: 400 })
    }

    // Special backdoor for demo/testing if needed (remove in production)
    if (code === "12345" && process.env.NODE_ENV === 'development') {
       return NextResponse.json({ success: true, token: "demo-token" })
    }

    const isValid = await verifyOtp(phone, code)

    if (isValid) {
      // In a real app, you would generate a JWT or session token here
      return NextResponse.json({ success: true, token: `auth-${Date.now()}` })
    } else {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 })
    }
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
