-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Description not available',
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
