-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
