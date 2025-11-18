import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

const VALID_REACTIONS = new Set(["love", "wow", "smart", "confused"]);

async function resolveStudent(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session?.user?.id && session.user.userType === "student") {
    const student = await prisma.student.findUnique({ where: { id: session.user.id } });
    if (student) {
      return student;
    }
  }

  const headerStudentId = request.headers.get("x-student-id");
  if (headerStudentId) {
    const student = await prisma.student.findUnique({ where: { id: headerStudentId } });
    if (student) {
      return student;
    }
  }

  return null;
}

async function getReactionCounts(articleId: string) {
  const grouped = await prisma.articleReaction.groupBy({
    by: ["reaction"],
    where: { articleId },
    _count: { reaction: true },
  });

  return grouped.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.reaction] = entry._count.reaction;
    return acc;
  }, {});
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: "Article ID is required" },
        { status: 400 },
      );
    }

    const student = await resolveStudent(request);

    let currentReaction: string | null = null;

    if (student) {
      const existing = await prisma.articleReaction.findUnique({
        where: {
          articleId_studentId: {
            articleId,
            studentId: student.id,
          },
        },
      });
      currentReaction = existing?.reaction ?? null;
    }

    const counts = await getReactionCounts(articleId);

    return NextResponse.json({
      success: true,
      data: { counts, currentReaction },
    });
  } catch (error) {
    console.error("Error fetching article reactions:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const student = await resolveStudent(request);
    if (!student) {
      return NextResponse.json(
        { success: false, error: "Hanya siswa yang sudah login yang dapat memberikan reaksi" },
        { status: 401 },
      );
    }

    const { articleId, reaction } = await request.json();

    if (!articleId || typeof articleId !== "string") {
      return NextResponse.json(
        { success: false, error: "Article ID tidak valid" },
        { status: 400 },
      );
    }

    if (reaction && !VALID_REACTIONS.has(reaction)) {
      return NextResponse.json(
        { success: false, error: "Tipe reaksi tidak dikenal" },
        { status: 400 },
      );
    }

    if (!reaction) {
      await prisma.articleReaction
        .delete({
          where: {
            articleId_studentId: {
              articleId,
              studentId: student.id,
            },
          },
        })
        .catch(() => null);
    } else {
      await prisma.articleReaction.upsert({
        where: {
          articleId_studentId: {
            articleId,
            studentId: student.id,
          },
        },
        update: { reaction },
        create: { articleId, studentId: student.id, reaction },
      });
    }

    const counts = await getReactionCounts(articleId);

    return NextResponse.json({
      success: true,
      data: { counts, currentReaction: reaction ?? null },
    });
  } catch (error) {
    console.error("Error saving article reaction:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
