/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Activity` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "currentEventId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_currentEventId_key" ON "User"("currentEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_userId_key" ON "Activity"("userId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentEventId_fkey" FOREIGN KEY ("currentEventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
