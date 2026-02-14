"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Format number with Persian locale ──────────
function formatToman(value: number): string {
  return value.toLocaleString("fa-IR");
}

// ─── Animated Checkmark (GPU-accelerated) ───────
function SuccessIcon() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Burst ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/40 ring-burst" />

      {/* Green circle (pops in) */}
      <div className="absolute inset-0 rounded-full bg-green-50 border-[3px] border-primary success-circle-pop" />

      {/* Checkmark icon (pops in after circle) */}
      <div className="absolute inset-0 flex items-center justify-center success-check-pop">
        <svg
          className="w-14 h-14 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Animated X (GPU-accelerated) ───────────────
function FailIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6 animate-shake">
      {/* Red circle (pops in) */}
      <div className="absolute inset-0 rounded-full bg-red-50 border-[3px] border-red-400 fail-circle-pop" />

      {/* X icon (pops in after circle) */}
      <div className="absolute inset-0 flex items-center justify-center fail-x-pop">
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Success Content ────────────────────────────
function SuccessContent({ amount }: { amount: number | null }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary via-white to-secondary/30 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Animated checkmark */}
        <SuccessIcon />

        {/* Title */}
        <h1 className="stagger-fade-in delay-600 text-3xl font-extrabold text-dark mb-3">
          ممنون از لطف و مهربونی شما
        </h1>

        {/* Subtitle */}
        <p className="stagger-fade-in delay-800 text-muted mb-8 leading-relaxed">
          حمایت‌تون به تیم کافه رسید و کلی انرژی بهشون داد
        </p>

        {/* Receipt-style confirmation card */}
        <div className="slide-up-bounce delay-1000 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 mb-8">
          {/* Header */}
          <div className="border-b-2 border-dashed border-gray-200 pb-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-green-600 font-bold">پرداخت موفق</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            {/* Amount row */}
            {amount && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">مبلغ پرداختی</span>
                <span className="text-dark font-extrabold text-base">
                  {formatToman(amount)} تومان
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-500">وضعیت</span>
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                تایید شده ✓
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">روش پرداخت</span>
              <span className="text-dark font-bold">درگاه زرین‌پال</span>
            </div>
          </div>

          {/* Bottom stamp */}
          <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
            <p className="text-xs text-gray-400">
              رسید پرداخت در تاریخچه بانک شما ثبت شده است
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="stagger-fade-in delay-1200">
          <Link
            href="/"
            className="inline-block text-primary font-bold hover:underline transition-all"
          >
            بازگشت به صفحه اصلی ←
          </Link>
        </div>
      </div>
    </main>
  );
}

// ─── Failed Content (completely different look) ─
function FailedContent() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        {/* Compact error banner */}
        <div className="slide-up-bounce bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Red top bar */}
          <div className="bg-red-500 py-6 px-4 text-center">
            <FailIcon />
            <h1 className="text-white text-xl font-bold">پرداخت ناموفق</h1>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="stagger-fade-in delay-400 text-muted text-sm text-center mb-5 leading-relaxed">
              نگران نباشید — مبلغی از حساب شما کسر نشده.
              <br />
              می‌تونید دوباره امتحان کنید.
            </p>

            {/* Possible reasons */}
            <div className="stagger-fade-in delay-600 bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-xs font-bold text-gray-600 mb-2">دلایل احتمالی:</p>
              <ul className="text-xs text-gray-400 space-y-1.5 list-inside">
                <li className="flex items-start gap-2">
                  <span className="text-red-300 mt-0.5">●</span>
                  لغو توسط کاربر
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-300 mt-0.5">●</span>
                  اختلال در اتصال اینترنت
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-300 mt-0.5">●</span>
                  مشکل موقت درگاه بانکی
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="stagger-fade-in delay-800 space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-red-500 text-white py-3 rounded-2xl font-bold hover:bg-red-600 transition-all"
              >
                تلاش دوباره
              </button>
              <Link
                href="/"
                className="block text-center text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Main Component with Router ─────────────────
function ThankYouContent() {
  const params = useSearchParams();
  const status = params.get("status");
  const amountParam = params.get("amount");
  const amount = amountParam ? parseInt(amountParam, 10) : null;

  if (status === "failed") {
    return <FailedContent />;
  }

  return <SuccessContent amount={amount && !isNaN(amount) ? amount : null} />;
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-secondary">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">در حال بررسی پرداخت...</p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
