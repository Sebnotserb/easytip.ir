"use client";

import { useState, useEffect, useRef } from "react";

/** Café settings page — update name, description, thank-you message, and logo */
export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    thankYouMessage: "",
    instagram: "",
    telegramChatId: "",
  });
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        const cafe = data.user?.cafe || data.cafe;
        if (cafe) {
          setForm({
            name: cafe.name || "",
            description: cafe.description || "",
            thankYouMessage: cafe.thankYouMessage || "",
            instagram: cafe.instagram || "",
            telegramChatId: cafe.telegramChatId || "",
          });
          setSlug(cafe.slug || "");
          if (cafe.logo) {
            setLogo(cafe.logo);
            setLogoPreview(cafe.logo);
          }
        }
      })
      .finally(() => setPageLoading(false));
  }, []);

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("فرمت فایل مجاز نیست. فقط JPG، PNG و WebP قابل قبول است.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("حجم فایل نباید بیشتر از ۲ مگابایت باشد");
      return;
    }

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setError("");

    // Upload to server
    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "خطا در آپلود لوگو");
        setLogoPreview(logo); // revert preview
        return;
      }

      setLogo(data.url);
      setLogoPreview(data.url);
    } catch {
      setError("خطا در آپلود لوگو");
      setLogoPreview(logo); // revert preview
    } finally {
      setLogoUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`/api/cafes/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          logo,
          instagram: form.instagram || null,
          telegramChatId: form.telegramChatId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "خطا در ذخیره تنظیمات");
        return;
      }

      setSuccess("تنظیمات با موفقیت ذخیره شد ✓");
    } catch {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse-soft text-gray-400">
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-dark">تنظیمات کافه</h1>

      <div className="max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-5"
        >
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          {/* ── Logo Upload ── */}
          <div>
            <label className="block text-sm font-bold mb-3">لوگوی کافه</label>
            <div className="flex items-center gap-4">
              {/* Logo preview circle */}
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview}
                    alt="لوگو"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">☕</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={logoUploading}
                  className="px-4 py-2 bg-secondary text-dark rounded-xl text-sm font-bold hover:bg-primary/20 transition-all disabled:opacity-50"
                >
                  {logoUploading
                    ? "در حال آپلود..."
                    : logoPreview
                    ? "تغییر لوگو"
                    : "انتخاب لوگو"}
                </button>

                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="px-4 py-2 text-red-500 text-xs hover:underline"
                  >
                    حذف لوگو
                  </button>
                )}

                <p className="text-xs text-gray-400">
                  JPG، PNG یا WebP — حداکثر ۲ مگابایت
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleLogoSelect}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">نام کافه</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              آدرس صفحه انعام
            </label>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500" dir="ltr">
              {typeof window !== "undefined"
                ? window.location.origin
                : ""}/cafe/{slug}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              توضیحات کافه
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              maxLength={500}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all resize-none"
              placeholder="توضیح کوتاه درباره کافه شما..."
            />
          </div>

          {/* ── Instagram Username ── */}
          <div>
            <label className="block text-sm font-bold mb-2">
              اینستاگرام کافه
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none" dir="ltr">
                @
              </span>
              <input
                type="text"
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value.replace(/^@/, "") })
                }
                maxLength={100}
                className="w-full p-3 pl-8 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
                placeholder="cafe_lamiz"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              نام کاربری اینستاگرام — در صفحه انعام به مشتریان نمایش داده می‌شود
            </p>
          </div>

          {/* ── Telegram Notification ── */}
          <div>
            <label className="block text-sm font-bold mb-2">
              اعلان تلگرام
            </label>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#229ED9] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <input
                type="text"
                value={form.telegramChatId}
                onChange={(e) =>
                  setForm({ ...form, telegramChatId: e.target.value.trim() })
                }
                maxLength={20}
                className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
                placeholder="شناسه چت تلگرام"
                dir="ltr"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              با فعال‌سازی، هر بار که مشتری انعام بده بهتون از تلگرام اطلاع می‌دیم.
              <br />
              برای دریافت شناسه، ربات{" "}
              <a
                href="https://t.me/userinfobot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold hover:underline"
              >
                @userinfobot
              </a>
              {" "}رو در تلگرام باز کنید و دکمه Start رو بزنید. عددی که نشون می‌ده رو اینجا وارد کنید.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              پیام خوشامدگویی سفارشی
            </label>
            <input
              type="text"
              value={form.thankYouMessage}
              onChange={(e) =>
                setForm({ ...form, thankYouMessage: e.target.value })
              }
              maxLength={200}
              className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-primary transition-all"
              placeholder="اگر از خدمات ما راضی بودید 💚"
            />
            <p className="text-xs text-gray-400 mt-1">
              این پیام در صفحه انعام به مشتری نمایش داده می‌شود
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || logoUploading}
            className="w-full py-3 bg-cta text-white rounded-xl font-bold hover:bg-green-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </button>
        </form>
      </div>
    </div>
  );
}
