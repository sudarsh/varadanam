/*
  Warnings:

  - The values [puja,prasad,donation,seva,other] on the enum `OfferingCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,confirmed,cancelled] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currency` on the `Offering` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Offering` table. All the data in the column will be lost.
  - You are about to drop the column `devoteeEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `devoteePhone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayResponse` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `gotram` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `nakshatram` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `offeringAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `offeringCurrency` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `offeringName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `receiptNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Order` table. All the data in the column will be lost.
  - The `paymentMethod` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `city` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `pincode` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `primaryColor` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `templeId` on the `Temple` table. All the data in the column will be lost.
  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,templeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Temple` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagline` to the `Temple` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HeroStyle" AS ENUM ('SOLID', 'GRADIENT', 'IMAGE');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('BASIC', 'PRO');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "OfferingCategory_new" AS ENUM ('DAILY_RITUAL', 'FESTIVAL', 'ARCHANA', 'ANNADANAM', 'DONATION', 'SPECIAL_SEVA');
ALTER TABLE "Offering" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Offering" ALTER COLUMN "category" TYPE "OfferingCategory_new" USING ("category"::text::"OfferingCategory_new");
ALTER TYPE "OfferingCategory" RENAME TO "OfferingCategory_old";
ALTER TYPE "OfferingCategory_new" RENAME TO "OfferingCategory";
DROP TYPE "OfferingCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('CREATED', 'PAID', 'FAILED', 'REFUNDED');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Offering" DROP CONSTRAINT "Offering_templeId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_templeId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_templeId_fkey";

-- DropIndex
DROP INDEX "Order_receiptNumber_key";

-- DropIndex
DROP INDEX "Order_templeId_paymentStatus_idx";

-- DropIndex
DROP INDEX "Temple_templeId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_templeId_idx";

-- AlterTable
ALTER TABLE "Offering" DROP COLUMN "currency",
DROP COLUMN "imageUrl",
ADD COLUMN     "emoji" TEXT NOT NULL DEFAULT '🪔',
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "category" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "devoteeEmail",
DROP COLUMN "devoteePhone",
DROP COLUMN "gatewayResponse",
DROP COLUMN "gotram",
DROP COLUMN "nakshatram",
DROP COLUMN "notes",
DROP COLUMN "offeringAmount",
DROP COLUMN "offeringCurrency",
DROP COLUMN "offeringName",
DROP COLUMN "paidAt",
DROP COLUMN "paymentStatus",
DROP COLUMN "quantity",
DROP COLUMN "receiptNumber",
DROP COLUMN "totalAmount",
DROP COLUMN "transactionId",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "gothram" TEXT,
ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestMobile" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "nakshatra" TEXT,
ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT,
ADD COLUMN     "receiptSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specialInstructions" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "devoteeName" DROP NOT NULL,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" TEXT,
ALTER COLUMN "status" SET DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "Temple" DROP COLUMN "city",
DROP COLUMN "contactEmail",
DROP COLUMN "contactPhone",
DROP COLUMN "country",
DROP COLUMN "logo",
DROP COLUMN "pincode",
DROP COLUMN "primaryColor",
DROP COLUMN "state",
DROP COLUMN "street",
DROP COLUMN "templeId",
ADD COLUMN     "accentColor" TEXT NOT NULL DEFAULT '#C8590A',
ADD COLUMN     "address" TEXT,
ADD COLUMN     "announcementColor" TEXT,
ADD COLUMN     "announcementEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "announcementText" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "footerMessage" TEXT,
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "heroOverlayOpacity" INTEGER NOT NULL DEFAULT 40,
ADD COLUMN     "heroStyle" "HeroStyle" NOT NULL DEFAULT 'SOLID',
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "razorpayKeyId" TEXT,
ADD COLUMN     "razorpayKeySecret" TEXT,
ADD COLUMN     "razorpayWebhookSecret" TEXT,
ADD COLUMN     "showLotusDivider" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showOmSymbol" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "tagline" TEXT NOT NULL,
ADD COLUMN     "youtubeUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastLogin",
ADD COLUMN     "gothram" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isGuest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "mobile" TEXT,
ADD COLUMN     "nakshatra" TEXT,
ADD COLUMN     "notes" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "UserRole";

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON "Order"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_templeId_key" ON "User"("email", "templeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offering" ADD CONSTRAINT "Offering_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
