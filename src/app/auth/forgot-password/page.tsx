"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا");
        return;
      }

      setSent(true);
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-2xl font-bold text-dark mb-4">
            ایمیل بازیابی ارسال شد
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            اگر ایمیل شما در سیستم ثبت باشد، لینک بازیابی رمز عبور
            به آن ارسال خواهد شد.
          </p>
          <Link
            href="/auth/login"
            className="text-primary font-bold hover:underline"
          >
            بازگشت به صفحه ورود
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-primary mb-2">ایزی‌تیپ</h1>
          </Link>
          <p className="text-gray-500">بازیابی رمز عبور</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-card border border-gray-100"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور برای شما ارسال شود.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-bold text-dark mb-2">
              ایمیل
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="email@example.com"
              dir="ltr"
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-cta text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            رمز خود را به یاد آوردید؟{" "}
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:underline"
            >
              ورود
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
