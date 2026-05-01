import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/Toast";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ایزی‌تیپ | انعام دیجیتال",
    template: "%s | ایزی‌تیپ",
  },
  description:
    "پلتفرم انعام دیجیتال برای کافه‌ها و رستوران‌ها. با اسکن QR کد به‌راحتی انعام دهید.",
  keywords: ["انعام", "کافه", "رستوران", "QR", "تیپ", "پرداخت آنلاین"],
  authors: [{ name: "EasyTip" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6BCF9C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="enamad" content="51776869" />
      </head>
      <body className="min-h-screen">
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
        <div style={{ position: "absolute", overflow: "hidden", width: 0, height: 0 }} aria-hidden="true">
          <a referrerPolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=707249&Code=cAnUJyqX8J5vxj2Oc25ZyASEopJc8q4Z">
            <img referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=707249&Code=cAnUJyqX8J5vxj2Oc25ZyASEopJc8q4Z" alt="enamad" style={{ width: 0, height: 0 }} data-code="cAnUJyqX8J5vxj2Oc25ZyASEopJc8q4Z" />
          </a>
        </div>
      </body>
    </html>
  );
}
