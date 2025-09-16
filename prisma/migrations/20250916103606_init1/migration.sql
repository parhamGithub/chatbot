/*
  Warnings:

  - You are about to drop the column `userId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the `_ModuleUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Result" DROP CONSTRAINT "Result_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ModuleUsers" DROP CONSTRAINT "_ModuleUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ModuleUsers" DROP CONSTRAINT "_ModuleUsers_B_fkey";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Message" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Module" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "public"."Notification" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Result" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."Session" DROP COLUMN "userId";

-- DropTable
DROP TABLE "public"."_ModuleUsers";

-- CreateTable
CREATE TABLE "public"."Chat_Module" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "Chat_Module_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Chat_Module" ADD CONSTRAINT "Chat_Module_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat_Module" ADD CONSTRAINT "Chat_Module_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
