/*
  Warnings:

  - The `model` column on the `Chat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MODEL" AS ENUM ('GPT_4_O', 'GEMINI_2_FLASH', 'CLAUDE_3_7_SONNET');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "model",
ADD COLUMN     "model" "MODEL";
