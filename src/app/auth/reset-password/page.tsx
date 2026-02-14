"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token");
  const { t, locale, dir } = useI18n();
  const isEn = locale === "en";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center" dir={dir}>
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-dark mb-4">{t("reset.invalidTitle")}</h1>
        <p className="text-gray-500 mb-6">
          {t("reset.invalidDesc")}
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-primary font-bold hover:underline"
        >
          {t("reset.newLink")}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center" dir={dir}>
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-dark mb-4">
          {t("reset.successTitle")}
        </h1>
        <p className="text-gray-500 mb-6">
          {t("reset.successDesc")}
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-cta text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-600 transition-all"
        >
          {t("reset.loginButton")}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(isEn ? "Password must be at least 6 characters" : "رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    if (password !== confirmPassword) {
      setError(isEn ? "Passwords do not match" : "رمز عبور و تکرار آن یکسان نیستند");
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
      setError(isEn ? "Connection error" : "خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md" dir={dir}>
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {isEn ? "EasyTip" : "ایزی‌تیپ"}
          </h1>
        </Link>
        <p className="text-gray-500">{t("reset.subtitle")}</p>
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
            {t("reset.newPassword")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
            placeholder={isEn ? "At least 6 characters" : "حداقل ۶ کاراکتر"}
            dir="ltr"
            autoComplete="new-password"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-dark mb-2">
            {t("reset.confirmPassword")}
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
          {loading ? t("reset.loading") : t("reset.submit")}
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
