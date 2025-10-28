-- CreateEnum
CREATE TYPE "QuizQuestionType" AS ENUM ('MULTIPLE_CHOICE', 'MULTI_SELECT', 'TRUE_FALSE', 'SHORT_ANSWER', 'NUMERIC', 'SCALE');

-- CreateEnum
CREATE TYPE "QuizSessionMode" AS ENUM ('LIVE', 'HOMEWORK');

-- CreateEnum
CREATE TYPE "QuizSessionStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuizSessionEventType" AS ENUM ('CREATED', 'HOST_JOINED', 'STARTED', 'QUESTION_ADVANCED', 'QUESTION_REWOUND', 'PAUSED', 'RESUMED', 'FINISHED', 'SCORE_ADJUSTED', 'MANUAL_GRADE');

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT,
    "tags" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "timePerQuestion" INTEGER,
    "defaultPoints" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" "QuizQuestionType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "richContent" JSONB,
    "mediaUrl" TEXT,
    "options" JSONB,
    "correctAnswers" JSONB,
    "competencyTag" TEXT,
    "explanation" TEXT,
    "difficulty" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "timeLimitSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "mode" "QuizSessionMode" NOT NULL,
    "status" "QuizSessionStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledStart" TIMESTAMP(3),
    "scheduledEnd" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "currentQuestionId" TEXT,
    "currentQuestionStartedAt" TIMESTAMP(3),
    "homeworkWindowStart" TIMESTAMP(3),
    "homeworkWindowEnd" TIMESTAMP(3),
    "maxAttemptsPerQuestion" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_participants" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT,
    "displayName" TEXT NOT NULL,
    "avatarColor" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION,
    "responseCount" INTEGER NOT NULL DEFAULT 0,
    "isKicked" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,

    CONSTRAINT "quiz_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_responses" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" JSONB,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isCorrect" BOOLEAN,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),
    "gradedBy" TEXT,
    "latencyMs" INTEGER,
    "feedback" TEXT,
    "metadata" JSONB,

    CONSTRAINT "quiz_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_session_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "QuizSessionEventType" NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_session_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_slug_key" ON "quizzes"("slug");

-- CreateIndex
CREATE INDEX "quizzes_createdBy_idx" ON "quizzes"("createdBy");

-- CreateIndex
CREATE INDEX "quizzes_isPublic_idx" ON "quizzes"("isPublic");

-- CreateIndex
CREATE INDEX "quiz_questions_quizId_idx" ON "quiz_questions"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_questions_quizId_order_key" ON "quiz_questions"("quizId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_sessions_code_key" ON "quiz_sessions"("code");

-- CreateIndex
CREATE INDEX "quiz_sessions_quizId_idx" ON "quiz_sessions"("quizId");

-- CreateIndex
CREATE INDEX "quiz_sessions_hostId_idx" ON "quiz_sessions"("hostId");

-- CreateIndex
CREATE INDEX "quiz_sessions_status_idx" ON "quiz_sessions"("status");

-- CreateIndex
CREATE INDEX "quiz_sessions_mode_idx" ON "quiz_sessions"("mode");

-- CreateIndex
CREATE INDEX "quiz_sessions_scheduledStart_idx" ON "quiz_sessions"("scheduledStart");

-- CreateIndex
CREATE INDEX "quiz_sessions_scheduledEnd_idx" ON "quiz_sessions"("scheduledEnd");

-- CreateIndex
CREATE INDEX "quiz_participants_sessionId_idx" ON "quiz_participants"("sessionId");

-- CreateIndex
CREATE INDEX "quiz_participants_studentId_idx" ON "quiz_participants"("studentId");

-- CreateIndex
CREATE INDEX "quiz_participants_score_idx" ON "quiz_participants"("score");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_participants_sessionId_displayName_key" ON "quiz_participants"("sessionId", "displayName");

-- CreateIndex
CREATE INDEX "quiz_responses_sessionId_idx" ON "quiz_responses"("sessionId");

-- CreateIndex
CREATE INDEX "quiz_responses_questionId_idx" ON "quiz_responses"("questionId");

-- CreateIndex
CREATE INDEX "quiz_responses_participantId_idx" ON "quiz_responses"("participantId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_responses_participantId_questionId_sessionId_key" ON "quiz_responses"("participantId", "questionId", "sessionId");

-- CreateIndex
CREATE INDEX "quiz_session_events_sessionId_idx" ON "quiz_session_events"("sessionId");

-- CreateIndex
CREATE INDEX "quiz_session_events_type_idx" ON "quiz_session_events"("type");

-- CreateIndex
CREATE INDEX "quiz_session_events_createdAt_idx" ON "quiz_session_events"("createdAt");

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "quiz_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_participants" ADD CONSTRAINT "quiz_participants_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_participants" ADD CONSTRAINT "quiz_participants_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_responses" ADD CONSTRAINT "quiz_responses_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_responses" ADD CONSTRAINT "quiz_responses_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "quiz_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_responses" ADD CONSTRAINT "quiz_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_responses" ADD CONSTRAINT "quiz_responses_gradedBy_fkey" FOREIGN KEY ("gradedBy") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_session_events" ADD CONSTRAINT "quiz_session_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_session_events" ADD CONSTRAINT "quiz_session_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
