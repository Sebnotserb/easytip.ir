"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-dark mb-4">لینک نامعتبر</h1>
        <p className="text-gray-500 mb-6">
          لینک بازیابی رمز عبور نامعتبر یا منقضی شده است.
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-primary font-bold hover:underline"
        >
          درخواست لینک جدید
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-dark mb-4">
          رمز عبور تغییر کرد
        </h1>
        <p className="text-gray-500 mb-6">
          رمز عبور شما با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-cta text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-600 transition-all"
        >
          ورود به حساب
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا");
        return;
      }

      setSuccess(true);
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-4xl font-bold text-primary mb-2">ایزی‌تیپ</h1>
        </Link>
        <p className="text-gray-500">تنظیم رمز عبور جدید</p>
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

        <div className="mb-4">
          <label className="block text-sm font-bold text-dark mb-2">
            رمز عبور جدید
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
            placeholder="حداقل ۶ کاراکتر"
            dir="ltr"
            autoComplete="new-password"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-dark mb-2">
            تکرار رمز عبور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
            dir="ltr"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-cta text-white rounded-xl font-bold text-lg hover:bg-green-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "در حال ذخیره..." : "ذخیره رمز عبور جدید"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-center text-gray-400">در حال بارگذاری...</div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
