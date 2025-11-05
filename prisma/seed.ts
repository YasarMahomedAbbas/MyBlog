import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createLogger } from "../src/lib/logging";

const prisma = new PrismaClient();

async function main() {
  const logger = createLogger({ service: "seed" });
  logger.info("🌱 Starting seed...");

  // Hash passwords
  const hashedPassword = await bcrypt.hash("test", 12);

  // Create test user with preferences
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "Test User",
      password: hashedPassword,
      role: "USER",
      preferences: {
        create: {
          theme: "SYSTEM",
        },
      },
    },
  });

  // Create admin user with preferences
  const adminUser = await prisma.user.upsert({
    where: { email: "yasar.tm44@gmail.com" },
    update: {},
    create: {
      email: "yasar.tm44@gmail.com",
      name: "Yasar (Admin)",
      password: hashedPassword,
      role: "ADMIN",
      preferences: {
        create: {
          theme: "SYSTEM",
        },
      },
    },
  });

  logger.info("✅ Created users:");
  logger.info(`  - Test User: ${testUser.email} (Role: ${testUser.role})`);
  logger.info(`  - Admin User: ${adminUser.email} (Role: ${adminUser.role})`);
  logger.info("🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    const logger = createLogger({ service: "seed" });
    logger.error("❌ Seed failed", { err: e });
    await prisma.$disconnect();
    process.exit(1);
  });
