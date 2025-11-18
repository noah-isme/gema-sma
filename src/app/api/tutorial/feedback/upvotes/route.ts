import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

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

export async function POST(request: NextRequest) {
  try {
    const student = await resolveStudent(request);
    if (!student) {
      return NextResponse.json(
        { success: false, error: "Hanya siswa yang sudah login yang dapat memberikan dukungan" },
        { status: 401 },
      );
    }

    const { feedbackId } = await request.json();

    if (!feedbackId || typeof feedbackId !== "string") {
      return NextResponse.json(
        { success: false, error: "Feedback ID tidak valid" },
        { status: 400 },
      );
    }

    const existing = await prisma.articleFeedbackUpvote.findUnique({
      where: {
        feedbackId_studentId: {
          feedbackId,
          studentId: student.id,
        },
      },
    });

    let hasUpvoted = false;

    if (existing) {
      await prisma.articleFeedbackUpvote.delete({
        where: {
          feedbackId_studentId: {
            feedbackId,
            studentId: student.id,
          },
        },
      });
    } else {
      await prisma.articleFeedbackUpvote.create({
        data: {
          feedbackId,
          studentId: student.id,
        },
      });
      hasUpvoted = true;
    }

    const count = await prisma.articleFeedbackUpvote.count({
      where: { feedbackId },
    });

    return NextResponse.json({
      success: true,
      data: {
        upvoted: hasUpvoted,
        count,
      },
    });
  } catch (error) {
    console.error("Error toggling feedback upvote:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
