import "server-only"

const BASE_URL = process.env.BASE_SMS_URL
const API_ENDPOINT = `${BASE_URL}/api/send`

export async function sendSMS(to: string, patternCode: string, inputData: Record<string, string>) {
    try {
        const apiToken = process.env.FARAZ_SMS_API_KEY
        const fromNumber = process.env.FARAZ_SMS_FROM

        if (!apiToken) {
            return false
        }

        let normalizedPhone = to.replace(/^(\+98|0098|98|0)/, "")
        if (!normalizedPhone.startsWith("9")) {
            normalizedPhone = "9" + normalizedPhone
        }
        const recipientE164 = `+98${normalizedPhone}`

        const payload = {
            sending_type: "pattern",
            from_number: fromNumber,
            code: patternCode,
            recipients: [recipientE164],
            params: inputData,
        }

        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": apiToken,
            },
            body: JSON.stringify(payload),
            cache: 'no-store'

        })

        if (!response.ok) {
            // برای مصرف کامل بدنه پاسخ در صورت خطا
            await response.text()
            return false
        }

        const result = await response.json()
        // بررسی وضعیت "status: true" در متای پاسخ
        return result.meta && result.meta.status === true
    } catch (error) {
        return false
    }
}

export async function sendOTPSMS(to: string, otpCode: string) {
    const patternCode = process.env.FARAZ_OTP_PATTERN_CODE

    if (!patternCode) {
        return false
    }

    // کلید متغیر الگو بر روی "code" تنظیم شده است.
    return await sendSMS(to, patternCode, {
        "code": otpCode,
    })
}
