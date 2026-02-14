"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function FooterContact() {
  const [open, setOpen] = useState(false);
  const { locale } = useI18n();
  const isEn = locale === "en";

  return (
    <div className="mt-6 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-primary transition-colors"
      >
        <span>{isEn ? "Contact Us" : "تماس با ما"}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-3 animate-fade-in-up">
          <a
            href="mailto:saberyousefniaa@gmail.com"
            className="flex flex-row-reverse items-center gap-2 text-gray-400 text-sm hover:text-primary transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gmail.png" alt="ایمیل" className="w-5 h-5" />
            <span dir="ltr">saberyousefniaa@gmail.com</span>
          </a>
          <a
            href="https://t.me/Saberyoun"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row-reverse items-center gap-2 text-gray-400 text-sm hover:text-primary transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/telegram.png" alt="تلگرام" className="w-5 h-5" />
            <span dir="ltr">@Saberyoun</span>
          </a>
        </div>
      )}
    </div>
  );
}
