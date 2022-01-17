-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email"    VarChar(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
