-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_currentEventId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "currentEventId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentEventId_fkey" FOREIGN KEY ("currentEventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
