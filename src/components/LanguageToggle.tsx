"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "fa" ? "en" : "fa")}
      className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-bold transition-all hover:bg-gray-200 relative overflow-hidden"
      style={{ minWidth: "72px", height: "30px" }}
      aria-label="Toggle language"
    >
      {/* Sliding indicator */}
      <div
        className="absolute top-0.5 w-[34px] h-[26px] bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out"
        style={{
          left: locale === "en" ? "2px" : "calc(100% - 36px)",
        }}
      />

      {/* EN label */}
      <span
        className={`relative z-10 w-[34px] text-center transition-colors duration-200 ${
          locale === "en" ? "text-dark" : "text-gray-400"
        }`}
      >
        EN
      </span>

      {/* FA label */}
      <span
        className={`relative z-10 w-[34px] text-center transition-colors duration-200 ${
          locale === "fa" ? "text-dark" : "text-gray-400"
        }`}
      >
        FA
      </span>
    </button>
  );
}
