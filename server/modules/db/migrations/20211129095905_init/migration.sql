/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Widget` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[facebookId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Widget` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `facebookId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_userId_fkey";

-- DropForeignKey
ALTER TABLE "Widget" DROP CONSTRAINT "Widget_serviceId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "facebookId" TEXT NOT NULL,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "username" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Widget" DROP COLUMN "serviceId",
ADD COLUMN     "nbParams" INTEGER NOT NULL DEFAULT 2,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "UserWidget" (
    "id" SERIAL NOT NULL,
    "widgetId" INTEGER NOT NULL,
    "params" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserWidget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");

-- CreateIndex
CREATE UNIQUE INDEX "Widget_name_key" ON "Widget"("name");

-- AddForeignKey
ALTER TABLE "UserWidget" ADD CONSTRAINT "UserWidget_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWidget" ADD CONSTRAINT "UserWidget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
