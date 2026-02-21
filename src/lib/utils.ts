/**
 * Shared Utility Functions
 * Formatting, calculations, rate limiting, and CSV generation
 */

// ─── Number & Date Formatting ────────────────────

/** Format number with Persian locale separators */
export function formatNumber(n: number): string {
  return n.toLocaleString("fa-IR");
}

/** Format date in Persian locale */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** Format short date (numbers only) */
export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR").format(date);
}

// ─── Slug Generation ─────────────────────────────

/** Generate URL-safe Latin-only slug using random ID + optional transliterated name */
export function generateSlug(name: string): string {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const latin = name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return latin ? `${latin}-${id}` : `cafe-${id}`;
}

// ─── Financial Calculations ──────────────────────

const COMMISSION_RATE = 0.05; // 5% platform commission
const EARLY_WITHDRAWAL_FEE = 0.1; // 10% fee for balance < 500k
const FREE_WITHDRAWAL_THRESHOLD = 500_000; // Toman

/** Calculate 5% platform commission */
export function calculateCommission(amount: number): number {
  return Math.ceil(amount * COMMISSION_RATE);
}

/** Calculate withdrawal fee (10% if balance < 500,000 Toman, else 0) */
export function calculateWithdrawalFee(amount: number): number {
  if (amount >= FREE_WITHDRAWAL_THRESHOLD) return 0;
  return Math.ceil(amount * EARLY_WITHDRAWAL_FEE);
}

// ─── Rate Limiting (In-Memory for MVP) ───────────

const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

/**
 * Simple in-memory rate limiter.
 * Returns `true` if request is allowed, `false` if rate-limited.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// ─── CSV Generation ──────────────────────────────

/** Generate a CSV string from headers and rows */
export function generateCSV(
  headers: string[],
  rows: string[][]
): string {
  // Add BOM for proper Persian character display in Excel
  const bom = "\uFEFF";
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) =>
    row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
  );
  return bom + [headerLine, ...dataLines].join("\n");
}

// ─── Input Sanitization ─────────────────────────

/** Sanitize text input: trim and limit length */
export function sanitizeText(
  input: string | undefined | null,
  maxLength: number
): string | null {
  if (!input) return null;
  return input.trim().substring(0, maxLength) || null;
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
