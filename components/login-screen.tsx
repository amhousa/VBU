"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Phone, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [isLoading, setIsLoading] = useState(false)

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate Iranian phone number format
    const iranPhoneRegex = /^(\+98|0)?9\d{9}$/
    if (!iranPhoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Iranian mobile number (e.g., 09123456789).",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send code")
      }

      setStep("otp")
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, code: otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid code")
      }

      localStorage.setItem("vbu_auth", "true")
      onLogin()
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center font-marker">Welcome to VBU</CardTitle>
        <CardDescription className="text-center">
          {step === "phone" 
            ? "Enter your mobile number to continue" 
            : `Enter the code sent to ${phoneNumber}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="09123456789"
                  className="pl-9"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending Code..." : "Send Code"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                placeholder="12345"
                className="text-center tracking-widest text-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={5}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify & Login"}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full" 
              onClick={() => setStep("phone")}
              type="button"
            >
              Change Number
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  )
}
