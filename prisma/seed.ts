/**
 * Database Seed Script
 * Creates sample data for development and testing.
 *
 * Run: npm run db:seed
 *
 * Default accounts:
 *   Admin:      admin@mytip.ir / admin123
 *   Café owner: cafe@mytip.ir  / cafe123
 *   Sample café slug: cafe-lamiz
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Admin User ──
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mytip.ir" },
    update: {},
    create: {
      email: "admin@mytip.ir",
      password: adminPassword,
      name: "مدیر سیستم",
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin user: ${admin.email}`);

  // ── Café Owner ──
  const ownerPassword = await bcrypt.hash("cafe123", 12);
  const owner = await prisma.user.upsert({
    where: { email: "cafe@mytip.ir" },
    update: {},
    create: {
      email: "cafe@mytip.ir",
      password: ownerPassword,
      name: "محمد رضایی",
      role: "CAFE_OWNER",
    },
  });
  console.log(`✓ Café owner: ${owner.email}`);

  // ── Sample Café ──
  const cafe = await prisma.cafe.upsert({
    where: { slug: "cafe-lamiz" },
    update: {},
    create: {
      name: "کافه لمیز",
      slug: "cafe-lamiz",
      description: "بهترین قهوه تخصصی شهر با فضایی دنج و مدرن",
      thankYouMessage: "ممنون که مهمان ما بودید 💚",
      ownerId: owner.id,
      walletBalance: 185_000,
      totalTips: 485_000,
      isActive: true,
    },
  });
  console.log(`✓ Café: ${cafe.name} (/${cafe.slug})`);

  // ── Sample Tips ──
  const tipData = [
    {
      amount: 20_000,
      commission: 1_000,
      totalPaid: 21_000,
      rating: 5,
      comment: "قهوه عالی بود! حتماً دوباره میام 👌",
      nickname: "علی",
      status: "PAID" as const,
      daysAgo: 1,
    },
    {
      amount: 50_000,
      commission: 2_500,
      totalPaid: 52_500,
      rating: 4,
      comment: "سرویس‌دهی خوبی داشتید. فقط یکم شلوغ بود.",
      nickname: null,
      status: "PAID" as const,
      daysAgo: 3,
    },
    {
      amount: 10_000,
      commission: 500,
      totalPaid: 10_500,
      rating: 5,
      comment: null,
      nickname: "مریم",
      status: "PAID" as const,
      daysAgo: 5,
    },
    {
      amount: 30_000,
      commission: 1_500,
      totalPaid: 31_500,
      rating: 3,
      comment: "قهوه معمولی بود ولی فضای کافه قشنگه",
      nickname: "رضا",
      status: "PAID" as const,
      daysAgo: 8,
    },
    {
      amount: 20_000,
      commission: 1_000,
      totalPaid: 21_000,
      rating: 5,
      comment: "بهترین لاته‌ای که خوردم! ☕",
      nickname: "سارا",
      status: "PAID" as const,
      daysAgo: 12,
    },
    {
      amount: 50_000,
      commission: 2_500,
      totalPaid: 52_500,
      rating: 4,
      comment: "دسر تیرامیسو فوق‌العاده بود",
      nickname: null,
      status: "PAID" as const,
      daysAgo: 18,
    },
    {
      amount: 10_000,
      commission: 500,
      totalPaid: 10_500,
      rating: 5,
      comment: null,
      nickname: "امیر",
      status: "PAID" as const,
      daysAgo: 25,
    },
  ];

  let tipCount = 0;
  for (const data of tipData) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - data.daysAgo);
    createdAt.setHours(
      Math.floor(Math.random() * 12) + 10,
      Math.floor(Math.random() * 60)
    );

    const tip = await prisma.tip.create({
      data: {
        amount: data.amount,
        commission: data.commission,
        totalPaid: data.totalPaid,
        rating: data.rating,
        comment: data.comment,
        nickname: data.nickname,
        cafeId: cafe.id,
        status: data.status,
        paymentRef: `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        ipAddress: "127.0.0.1",
        createdAt,
      },
    });

    // Create matching transaction
    await prisma.transaction.create({
      data: {
        amount: data.totalPaid,
        type: "TIP_PAYMENT",
        status: "COMPLETED",
        reference: `${100000000 + Math.floor(Math.random() * 900000000)}`,
        authority: `A00000000000000000000000000${Math.floor(Math.random() * 1000000)}`,
        tipId: tip.id,
        createdAt,
      },
    });

    tipCount++;
  }
  console.log(`✓ ${tipCount} sample tips created`);

  // ── Sample Payout ──
  await prisma.payout.create({
    data: {
      amount: 300_000,
      fee: 30_000,
      netAmount: 270_000,
      cafeId: cafe.id,
      bankInfo: "IR820540102680020817909002",
      status: "COMPLETED",
    },
  });
  console.log(`✓ 1 sample payout created`);

  console.log("\n✅ Seed completed successfully!");
  console.log("─────────────────────────────────");
  console.log("  Admin:  admin@mytip.ir / admin123");
  console.log("  Café:   cafe@mytip.ir  / cafe123");
  console.log("  Tip URL: /cafe/cafe-lamiz");
  console.log("─────────────────────────────────\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
