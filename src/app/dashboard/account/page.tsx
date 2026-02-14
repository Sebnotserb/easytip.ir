"use client";

import { useState, useEffect } from "react";

export default function AccountPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load current user data
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setForm((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          }));
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate password confirmation
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("رمز عبور جدید و تکرار آن یکسان نیستند");
      return;
    }

    if (form.phone && !/^09\d{9}$/.test(form.phone.trim())) {
      setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          ...(form.newPassword && {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در بروزرسانی");
        return;
      }

      setMessage("اطلاعات با موفقیت ذخیره شد");
      setForm((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark">حساب کاربری</h1>
        <p className="text-gray-500 text-sm mt-1">
          مدیریت اطلاعات شخصی و رمز عبور
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100 max-w-xl"
      >
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm text-center">
            {message}
          </div>
        )}

        {/* ── Personal Info ── */}
        <h2 className="font-bold text-dark mb-4">اطلاعات شخصی</h2>

        <div className="mb-4">
          <label className="block text-sm font-bold text-dark mb-2">نام</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
          />
        </div>

        <div className="mb-4">
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
            dir="ltr"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-dark mb-2">
            شماره موبایل
            <span className="text-gray-400 font-normal text-xs mr-1">
              (اختیاری)
            </span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
            maxLength={11}
          />
        </div>

        {/* ── Divider ── */}
        <hr className="my-6 border-gray-200" />

        {/* ── Change Password ── */}
        <h2 className="font-bold text-dark mb-4">تغییر رمز عبور</h2>
        <p className="text-xs text-gray-400 mb-4">
          فقط در صورت تمایل به تغییر رمز پر کنید
        </p>

        <div className="mb-4">
          <label className="block text-sm font-bold text-dark mb-2">
            رمز عبور فعلی
          </label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
            dir="ltr"
            autoComplete="current-password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-dark mb-2">
            رمز عبور جدید
          </label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            minLength={6}
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
            placeholder="حداقل ۶ کاراکتر"
            dir="ltr"
            autoComplete="new-password"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-dark mb-2">
            تکرار رمز عبور جدید
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
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
          {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}
