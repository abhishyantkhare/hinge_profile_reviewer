-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detailedFeedback" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);
