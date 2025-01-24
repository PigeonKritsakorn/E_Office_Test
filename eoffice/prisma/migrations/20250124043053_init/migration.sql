-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age_group" INTEGER NOT NULL,
    "gun_time" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "nationality" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
