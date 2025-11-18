import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get("threadId");

    const replies = await prisma.discussionReply.findMany({
      where: threadId ? { threadId } : undefined,
      orderBy: { createdAt: "asc" },
    });

    const data = replies.map((reply) => ({
      id: reply.id,
      threadId: reply.threadId,
      authorId: reply.authorId,
      authorName: reply.authorName,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      updatedAt: reply.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch discussion replies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch replies" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const {
      threadId,
      content,
      studentId,
      studentNumber,
    }: {
      threadId?: string;
      content?: string;
      studentId?: string;
      studentNumber?: string;
    } = await req.json();

    if (!threadId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Thread ID and content are required" },
        { status: 400 },
      );
    }

    let authorId: string | null = null;
    let authorName: string | null = null;

    if (session?.user?.userType === "admin") {
      authorId = session.user.id;
      authorName = session.user.name ?? "Admin GEMA";
    } else if (studentId && studentNumber) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { id: true, studentId: true, fullName: true, status: true },
      });

      if (
        !student ||
        student.status.toLowerCase() !== "active" ||
        student.studentId !== studentNumber
      ) {
        return NextResponse.json(
          { success: false, error: "Akun siswa tidak valid" },
          { status: 401 },
        );
      }

      authorId = student.id;
      authorName = student.fullName;
    } else {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const reply = await prisma.discussionReply.create({
      data: { threadId, authorId, authorName, content: content.trim() },
    });

    await prisma.discussionThread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: reply.id,
        threadId: reply.threadId,
        authorId: reply.authorId,
        authorName: reply.authorName,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to create discussion reply:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create reply" },
      { status: 500 },
    );
  }
}
