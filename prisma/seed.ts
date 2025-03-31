import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  return await prisma.product.createMany({
    data: [
      {
        name: 'Product A',
        description: 'Description for Product A',
        price: 100,
        stock: 50,
      },
      {
        name: 'Product B',
        description: 'Description for Product B',
        price: 200,
        stock: 30,
      },
      {
        name: 'Product C',
        description: 'Description for Product C',
        price: 300,
        stock: 20,
      },
      {
        name: 'Product D',
        description: 'Description for Product D',
        price: 400,
        stock: 10,
      },
      {
        name: 'Product E',
        description: 'Description for Product E',
        price: 500,
        stock: 5,
      },
    ],
  });
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
