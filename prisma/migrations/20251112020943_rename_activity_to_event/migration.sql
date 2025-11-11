-- Rename activities table to events (keeping old data)
ALTER TABLE "activities" RENAME TO "events";

-- Create new activities table for curriculum/lessons
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "quizId" TEXT,
    "codingTaskId" TEXT,
    "assignmentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timeLimit" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- Create indexes on new activities table
CREATE INDEX "activities_lessonId_idx" ON "activities"("lessonId");
CREATE INDEX "activities_type_idx" ON "activities"("type");
CREATE INDEX "activities_isActive_idx" ON "activities"("isActive");

-- Add foreign key constraints
ALTER TABLE "activities" ADD CONSTRAINT "activities_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activities" ADD CONSTRAINT "activities_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add relation fields to existing tables
ALTER TABLE "competency_maps" ADD COLUMN IF NOT EXISTS "activityId" TEXT;
ALTER TABLE "competency_maps" ADD CONSTRAINT "competency_maps_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "competency_maps_activityId_idx" ON "competency_maps"("activityId");

ALTER TABLE "grades" ADD COLUMN IF NOT EXISTS "activityId" TEXT;
ALTER TABLE "grades" ADD CONSTRAINT "grades_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "grades_activityId_idx" ON "grades"("activityId");
