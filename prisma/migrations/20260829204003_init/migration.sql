-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marks" (
    "id" SERIAL NOT NULL,
    "physics" INTEGER NOT NULL,
    "chemistry" INTEGER NOT NULL,
    "maths" INTEGER NOT NULL,
    "computer" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,

    CONSTRAINT "Marks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Marks_candidateId_key" ON "Marks"("candidateId");

-- AddForeignKey
ALTER TABLE "Marks" ADD CONSTRAINT "Marks_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
