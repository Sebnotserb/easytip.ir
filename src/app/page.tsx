import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "ایزی‌تیپ | انعام دیجیتال برای کافه‌ها و رستوران‌ها",
  description:
    "پلتفرم انعام دیجیتال با QR کد. مشتریان بدون ثبت‌نام و نصب اپ، با اسکن QR کد انعام می‌دهند. ثبت‌نام رایگان برای کافه‌ها و رستوران‌ها. داشبورد مدیریت، نظرات مشتری، برداشت آسان.",
  keywords: [
    "انعام دیجیتال",
    "تیپ آنلاین",
    "QR کد",
    "کافه",
    "رستوران",
    "انعام",
    "پرداخت آنلاین",
    "ایزی تیپ",
    "تیپ دیجیتال",
    "انعام کافه",
  ],
  openGraph: {
    title: "ایزی‌تیپ | انعام دیجیتال برای کافه‌ها",
    description:
      "مشتریان با اسکن QR کد، بدون ثبت‌نام و نصب اپ، به کافه شما انعام می‌دهند.",
    type: "website",
    locale: "fa_IR",
    siteName: "ایزی‌تیپ",
  },
  twitter: {
    card: "summary_large_image",
    title: "ایزی‌تیپ | انعام دیجیتال",
    description: "پلتفرم انعام دیجیتال با QR کد برای کافه‌ها و رستوران‌ها",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return <LandingPage />;
}
