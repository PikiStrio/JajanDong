-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);
