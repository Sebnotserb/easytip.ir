"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "ایمیل یا رمز عبور اشتباهه");
        return;
      }

      // Redirect based on role
      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
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
          <p className="text-muted text-sm">خوش اومدید — وارد پنل مدیریت بشید</p>
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

          <div className="mb-5">
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

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-dark">
                رمز عبور
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                فراموش کردید؟
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="••••••••"
              dir="ltr"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-cta text-white rounded-xl font-bold text-lg hover:bg-cta-hover transition-all disabled:bg-gray-300 disabled:cursor-not-allowed btn-press shadow-sm"
          >
            {loading ? "در حال ورود..." : "ورود به پنل"}
          </button>

          <p className="text-center text-sm text-muted mt-6">
            هنوز ثبت‌نام نکردید؟{" "}
            <Link
              href="/auth/register"
              className="text-cta font-bold hover:underline"
            >
              ثبت‌نام رایگان
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
