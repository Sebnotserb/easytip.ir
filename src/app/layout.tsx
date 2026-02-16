import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazir",
});

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
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <head>
        <meta name="enamad" content="51776869" />
      </head>
      <body className={`${vazirmatn.className} min-h-screen`}>
        <LanguageProvider>
          <ToastProvider>{children}</ToastProvider>
        </LanguageProvider>
        <div style={{ position: "absolute", overflow: "hidden", width: 0, height: 0 }} aria-hidden="true">
          <a referrerPolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=707249&Code=cAnUJyqX8J5vxj2Oc25ZyASEopJc8q4Z">
            <img referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=707249&Code=cAnUJyqX8J5vxj2Oc25ZyASEopJc8q4Z" alt="enamad" style={{ width: 0, height: 0 }} code="cAnUJyqX8J5vxj2Oc25ZyASEopJc8q4Z" />
          </a>
        </div>
      </body>
    </html>
  );
}
