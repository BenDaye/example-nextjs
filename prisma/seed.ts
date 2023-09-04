// cSpell:disable
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
const prisma = new PrismaClient();

async function main() {
  const firstAdmin = await prisma.user.upsert({
    where: { username: 'Laugh-nimbly-exotica-ascribe' },
    update: {},
    create: {
      username: 'Laugh-nimbly-exotica-ascribe',
      password: await hash('hc@s9A-*w%~Q3Ub243aq'),
      role: 'ADMIN',
    },
  });
  console.log({ firstAdmin });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
