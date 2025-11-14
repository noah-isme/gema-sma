/*
  Warnings:

  - Changed the type of `type` on the `activities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `category` on table `competencies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chapter` on table `modules` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('READING', 'QUIZ', 'CODING_LAB', 'DISCUSSION', 'NETWORK_LAB', 'PROJECT');

-- DropForeignKey
ALTER TABLE "public"."activities" DROP CONSTRAINT "activities_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."activities" DROP CONSTRAINT "activities_quizId_fkey";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "type",
ADD COLUMN     "type" "ActivityType" NOT NULL;

-- AlterTable
ALTER TABLE "assignments" ALTER COLUMN "allowedFileTypes" SET DEFAULT 'pdf,doc,docx,ppt,pptx';

-- AlterTable
ALTER TABLE "competencies" ALTER COLUMN "category" SET NOT NULL;

-- AlterTable
ALTER TABLE "modules" ALTER COLUMN "chapter" SET NOT NULL;

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "extracurricularInterests" JSONB;

-- CreateIndex
CREATE INDEX "activities_type_idx" ON "activities"("type");

-- CreateIndex
CREATE INDEX "competencies_level_idx" ON "competencies"("level");

-- CreateIndex
CREATE INDEX "competencies_subject_idx" ON "competencies"("subject");

-- CreateIndex
CREATE INDEX "competencies_category_idx" ON "competencies"("category");

-- CreateIndex
CREATE INDEX "competency_maps_quizId_idx" ON "competency_maps"("quizId");

-- CreateIndex
CREATE INDEX "grades_quizResponseId_idx" ON "grades"("quizResponseId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_maps" ADD CONSTRAINT "competency_maps_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competency_maps" ADD CONSTRAINT "competency_maps_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_quizResponseId_fkey" FOREIGN KEY ("quizResponseId") REFERENCES "quiz_responses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_gradedBy_fkey" FOREIGN KEY ("gradedBy") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
