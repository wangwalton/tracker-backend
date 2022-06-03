import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  prisma.user.create({ data: { email: "yuwaltonwang@gmail.com" } });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
