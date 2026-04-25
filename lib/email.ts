import "server-only"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, otp: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "VBU <info@amhousa.art>",
      to: email,
      subject: "Your VBU Verification Code",
      html: getVerificationEmailTemplate(otp, email),
    })

    if (error) {
      console.error("Resend error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Email send error:", error)
    return false
  }
}

function getVerificationEmailTemplate(otp: string, email: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VBU Verification Code</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            width: 100%;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }
        .header p {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 500;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .otp-box {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 30px;
            border-radius: 8px;
            margin: 30px 0;
            border: 2px solid #e0e7ff;
        }
        .otp-code {
            font-size: 48px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #667eea;
            font-family: 'Courier New', monospace;
            word-break: break-all;
        }
        .otp-label {
            font-size: 13px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            margin-bottom: 12px;
            display: block;
        }
        .description {
            font-size: 14px;
            color: #64748b;
            line-height: 1.6;
            margin: 20px 0;
        }
        .expiry {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 12px 16px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 13px;
            color: #92400e;
            text-align: left;
        }
        .email-display {
            color: #667eea;
            font-weight: 600;
            word-break: break-all;
        }
        .footer {
            border-top: 1px solid #e2e8f0;
            padding: 20px 40px;
            background: #f8fafc;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
        }
        .security-note {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 12px 16px;
            border-radius: 4px;
            margin: 20px 0;
            font-size: 12px;
            color: #1e40af;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 VBU</h1>
            <p>Verification Code</p>
        </div>
        <div class="content">
            <p class="description">
                Your verification code for <span class="email-display">${email}</span> is:
            </p>
            <div class="otp-box">
                <span class="otp-label">Enter this code</span>
                <div class="otp-code">${otp}</div>
            </div>
            <p class="description">
                This code will expire in <strong>10 minutes</strong>.
            </p>
            <div class="expiry">
                ⏱️ <strong>Code expires in 10 minutes</strong>
                <br>If you didn't request this code, please ignore this email.
            </div>
            <div class="security-note">
                🔒 <strong>Security tip:</strong> Never share this code with anyone. VBU support will never ask for this code.
            </div>
        </div>
        <div class="footer">
            <p>© 2024 VBU. All rights reserved.</p>
            <p style="margin-top: 8px;">This is an automated message, please don't reply to this email.</p>
        </div>
    </div>
</body>
</html>
  `.trim()
}
