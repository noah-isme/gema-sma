-- Ensure curriculum tables exist before creating new activities table
CREATE TABLE IF NOT EXISTS "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "level" TEXT NOT NULL DEFAULT 'XI',
    "subject" TEXT NOT NULL DEFAULT 'Informatika',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "courses_slug_key" UNIQUE ("slug")
);

CREATE INDEX IF NOT EXISTS "courses_level_idx" ON "courses"("level");
CREATE INDEX IF NOT EXISTS "courses_subject_idx" ON "courses"("subject");
CREATE INDEX IF NOT EXISTS "courses_isActive_idx" ON "courses"("isActive");

CREATE TABLE IF NOT EXISTS "modules" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "chapter" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "modules_slug_key" UNIQUE ("slug")
);

CREATE INDEX IF NOT EXISTS "modules_courseId_idx" ON "modules"("courseId");
CREATE INDEX IF NOT EXISTS "modules_chapter_idx" ON "modules"("chapter");
CREATE INDEX IF NOT EXISTS "modules_isActive_idx" ON "modules"("isActive");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'modules_courseId_fkey'
    ) THEN
        ALTER TABLE "modules"
        ADD CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "lessons" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "lessons_slug_key" UNIQUE ("slug")
);

CREATE INDEX IF NOT EXISTS "lessons_moduleId_idx" ON "lessons"("moduleId");
CREATE INDEX IF NOT EXISTS "lessons_isActive_idx" ON "lessons"("isActive");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'lessons_moduleId_fkey'
    ) THEN
        ALTER TABLE "lessons"
        ADD CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "competency_maps" (
    "id" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "activityId" TEXT,
    "quizId" TEXT,
    "moduleId" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competency_maps_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "competency_maps_competencyId_idx" ON "competency_maps"("competencyId");
CREATE INDEX IF NOT EXISTS "competency_maps_moduleId_idx" ON "competency_maps"("moduleId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'competency_maps_competencyId_fkey'
    ) THEN
        -- Ensure competencies table exists
        CREATE TABLE IF NOT EXISTS "competencies" (
            "id" TEXT NOT NULL,
            "code" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "level" TEXT NOT NULL DEFAULT 'XI',
            "subject" TEXT NOT NULL DEFAULT 'Informatika',
            "category" TEXT,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "competencies_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "competencies_code_key" UNIQUE ("code")
        );

        ALTER TABLE "competency_maps"
        ADD CONSTRAINT "competency_maps_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "grades" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "activityId" TEXT,
    "submissionId" TEXT,
    "quizResponseId" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "feedback" TEXT,
    "gradedBy" TEXT NOT NULL,
    "gradedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grades_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "grades_studentId_idx" ON "grades"("studentId");
CREATE INDEX IF NOT EXISTS "grades_submissionId_idx" ON "grades"("submissionId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'grades_studentId_fkey'
    ) THEN
        ALTER TABLE "grades"
        ADD CONSTRAINT "grades_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Rename activities table to events (keeping old data)
ALTER TABLE "activities" RENAME TO "events";

-- Rename primary key constraint so new activities table can reuse the name
ALTER TABLE "events" RENAME CONSTRAINT "activities_pkey" TO "events_pkey";

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
