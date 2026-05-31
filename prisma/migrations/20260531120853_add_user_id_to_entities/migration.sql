/*
  Warnings:

  - Added the required column `userId` to the `AssetAllocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MonthlySnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RecurringTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssetAllocation" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlySnapshot" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RecurringTemplate" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AssetAllocation" ADD CONSTRAINT "AssetAllocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringTemplate" ADD CONSTRAINT "RecurringTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlySnapshot" ADD CONSTRAINT "MonthlySnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
