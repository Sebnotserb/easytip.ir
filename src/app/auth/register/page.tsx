"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    cafeName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (form.phone && !/^09\d{9}$/.test(form.phone.trim())) {
      setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع بشه");
      return;
    }

    if (form.password.length < 6) {
      setError("رمز عبور حداقل ۶ کاراکتر باشه");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "مشکلی پیش اومد — لطفاً دوباره امتحان کنید");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("اتصال برقرار نشد — لطفاً اینترنت‌تون رو چک کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-extrabold text-dark mb-2">
              مای‌<span className="text-primary">تیپ</span>
            </h1>
          </Link>
          <p className="text-muted text-sm">در کمتر از ۲ دقیقه حسابتون رو بسازید</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-card border border-gray-100"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Step hint */}
          <p className="text-xs text-muted mb-4 font-bold">اطلاعات شخصی</p>

          <div className="mb-4">
            <label className="block text-sm font-bold text-dark mb-2">
              نام و نام‌خانوادگی
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="مثلاً: علی محمدی"
              autoComplete="name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-dark mb-2">
                ایمیل
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
                placeholder="email@example.com"
                dir="ltr"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-2">
                موبایل
                <span className="text-muted font-normal text-xs mr-1">(اختیاری)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                dir="ltr"
                autoComplete="tel"
                maxLength={11}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-dark mb-2">
              رمز عبور
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="حداقل ۶ کاراکتر"
              dir="ltr"
              autoComplete="new-password"
            />
          </div>

          {/* Step hint */}
          <p className="text-xs text-muted mb-4 font-bold border-t border-gray-100 pt-4">اطلاعات کافه</p>

          <div className="mb-6">
            <label className="block text-sm font-bold text-dark mb-2">
              نام کافه / رستوران
            </label>
            <input
              type="text"
              name="cafeName"
              value={form.cafeName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="مثلاً: کافه لمیز"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-cta text-white rounded-xl font-bold text-lg hover:bg-cta-hover transition-all disabled:bg-gray-300 disabled:cursor-not-allowed btn-press shadow-sm"
          >
            {loading ? "در حال ثبت‌نام..." : "ساخت حساب رایگان"}
          </button>

          <p className="text-center text-sm text-muted mt-6">
            قبلاً ثبت‌نام کردید؟{" "}
            <Link
              href="/auth/login"
              className="text-cta font-bold hover:underline"
            >
              ورود
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
