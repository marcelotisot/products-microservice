import { Logger } from "@nestjs/common";
import { Category, PrismaClient } from "@prisma/client";
import { faker, ro } from '@faker-js/faker';
import { SimpleFaker } from '@faker-js/faker';
import { UniqueEnforcer } from 'enforce-unique';
import slugify from "slugify";

const prisma = new PrismaClient();
const logger = new Logger('Database-Seeder');
const uniqueEnforcer = new UniqueEnforcer();
const customSimpleFaker = new SimpleFaker();

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}


function createRandomCategory() {
  const name = uniqueEnforcer.enforce(() => {
    return faker.lorem.word(10)
  });

  const slug = slugify(name).toLowerCase().trim();

  return {
    name,
    slug 
  }
}

function createRandomProduct() {
  // Valor unico
  const name = uniqueEnforcer.enforce(() => {
    return faker.commerce.productName();
  });

  const slug = slugify(name).toLowerCase().trim();
  const description = faker.commerce.productDescription();
  const price = faker.commerce.price();
  const stock = getRandomInt(80, 250);
  const sizes = customSimpleFaker.helpers.arrayElements(['XS', 'S', 'M', 'L', 'XL']);

  return {
    name,
    slug,
    description,
    price,
    stock,
    sizes
  }
}

async function seed() {
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // Crear 25 registros de prueba
  for (let index = 0; index < 25; index++) {
    const product = createRandomProduct();
    const category = createRandomCategory();

    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        slug: product.slug,
        price: Number(product.price),
        stock: product.stock,
        sizes: product.sizes,
        category: {
          create: {
            name: category.name,
            slug: category.slug
          }
        }
      }
    }); 
  }
  
  logger.log('Database seeding successfully!');
}

seed()
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
