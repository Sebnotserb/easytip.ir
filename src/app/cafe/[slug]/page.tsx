import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import TipForm from "@/components/TipForm";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

/** Generate SEO metadata for the café tipping page */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cafe = await prisma.cafe.findUnique({
    where: { slug: params.slug },
    select: { name: true },
  });

  if (!cafe) return { title: "کافه یافت نشد" };

  return {
    title: `انعام به ${cafe.name}`,
    description: `با اسکن QR کد، به ${cafe.name} انعام دهید. پرداخت سریع و امن.`,
    robots: "noindex", // tip pages shouldn't be indexed
  };
}

/**
 * Public tipping page — opened when customer scans QR code.
 * URL: /cafe/{slug}
 */
export default async function CafeTipPage({ params }: Props) {
  const cafe = await prisma.cafe.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      thankYouMessage: true,
      logo: true,
      instagram: true,
      isActive: true,
    },
  });

  if (!cafe || !cafe.isActive) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary to-white py-8 px-4">
      <TipForm
        cafeId={cafe.id}
        cafeName={cafe.name}
        cafeMessage={cafe.thankYouMessage || undefined}
        cafeLogo={cafe.logo || undefined}
        cafeInstagram={cafe.instagram || undefined}
      />
    </main>
  );
}
