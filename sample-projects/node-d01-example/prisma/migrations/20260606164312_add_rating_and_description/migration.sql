-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'No description provided.',
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
