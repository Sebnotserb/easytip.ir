import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
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
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
