-- AlterTable
ALTER TABLE "users" ADD COLUMN     "karmaPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "profileImageUrl" TEXT;
