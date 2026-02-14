/**
 * Telegram Bot notification utility.
 * Sends messages to cafe owners when tips are received.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TipNotification {
  cafeName: string;
  amount: number;
  rating?: number | null;
  comment?: string | null;
  nickname?: string | null;
}

/**
 * Send a tip notification to a cafe owner via Telegram.
 * Silently fails if the chat ID is missing or the request fails
 * (notifications should never block the payment flow).
 */
export async function sendTipNotification(
  chatId: string,
  tip: TipNotification
): Promise<void> {
  if (!BOT_TOKEN || !chatId) return;

  try {
    const lines: string[] = [
      `✅ <b>انعام جدید دریافت شد!</b>`,
      ``,
      `☕ کافه: <b>${tip.cafeName}</b>`,
      `💰 مبلغ: <b>${tip.amount.toLocaleString("fa-IR")} تومان</b>`,
    ];

    if (tip.rating) {
      const stars = "⭐".repeat(tip.rating);
      lines.push(`${stars} امتیاز: ${tip.rating}/۵`);
    }

    if (tip.nickname) {
      lines.push(`👤 از طرف: ${tip.nickname}`);
    }

    if (tip.comment) {
      lines.push(`💬 نظر: «${tip.comment}»`);
    }

    lines.push(``, `─────────────────`);
    lines.push(`🕐 ${new Date().toLocaleString("fa-IR")}`);

    const text = lines.join("\n");

    await fetch(`${API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    // Log but don't throw — notifications should never block payments
    console.error("Telegram notification failed:", error);
  }
}
