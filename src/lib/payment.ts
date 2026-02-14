/**
 * Zarinpal Payment Gateway Integration
 * Handles payment requests and verification
 * Supports both sandbox and production modes
 */

const IS_SANDBOX = process.env.ZARINPAL_SANDBOX === "true";
const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "";

const API_BASE = IS_SANDBOX
  ? "https://sandbox.zarinpal.com"
  : "https://api.zarinpal.com";

const PAYMENT_PAGE = IS_SANDBOX
  ? "https://sandbox.zarinpal.com/pg/StartPay"
  : "https://www.zarinpal.com/pg/StartPay";

interface PaymentRequestResult {
  success: boolean;
  authority?: string;
  paymentUrl?: string;
  error?: string;
}

interface PaymentVerifyResult {
  success: boolean;
  refId?: number;
  error?: string;
}

/**
 * Request a new payment from Zarinpal.
 * @param amount Amount in Toman
 * @param description Payment description shown to user
 * @param callbackUrl URL Zarinpal redirects to after payment
 */
export async function requestPayment(
  amount: number,
  description: string,
  callbackUrl: string
): Promise<PaymentRequestResult> {
  try {
    const response = await fetch(`${API_BASE}/pg/v4/payment/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: amount * 10, // Zarinpal expects Rial (1 Toman = 10 Rial)
        description,
        callback_url: callbackUrl,
      }),
    });

    const data = await response.json();

    if (data.data && data.data.code === 100) {
      return {
        success: true,
        authority: data.data.authority,
        paymentUrl: `${PAYMENT_PAGE}/${data.data.authority}`,
      };
    }

    return {
      success: false,
      error: data.errors?.message || "درخواست پرداخت ناموفق بود",
    };
  } catch (error) {
    console.error("Zarinpal request error:", error);
    return { success: false, error: "خطا در اتصال به درگاه پرداخت" };
  }
}

/**
 * Verify a completed payment with Zarinpal.
 * @param authority The authority code from the payment request
 * @param amount Original amount in Toman
 */
export async function verifyPayment(
  authority: string,
  amount: number
): Promise<PaymentVerifyResult> {
  try {
    const response = await fetch(`${API_BASE}/pg/v4/payment/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: amount * 10, // Convert to Rial
        authority,
      }),
    });

    const data = await response.json();

    // Code 100 = first successful verification, 101 = already verified
    if (data.data && (data.data.code === 100 || data.data.code === 101)) {
      return { success: true, refId: data.data.ref_id };
    }

    return {
      success: false,
      error: data.errors?.message || "تأیید پرداخت ناموفق بود",
    };
  } catch (error) {
    console.error("Zarinpal verify error:", error);
    return { success: false, error: "خطا در تأیید پرداخت" };
  }
}
