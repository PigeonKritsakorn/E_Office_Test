import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.create({
  //   data: {
  //     name: "Kritsakorn1",
  //     gender: "Male",
  //     age_group: 20,
  //     gun_time: 60,
  //     rank: 1,
  //     nationality: "Thai"
  //   }
  // })
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
  
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
