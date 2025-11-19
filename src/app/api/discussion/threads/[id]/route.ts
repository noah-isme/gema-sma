import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { serializeThread } from "@/lib/discussion/serializer";
import { authOptions } from "@/lib/auth-config";

const baseThreadInclude = {
  _count: { select: { replies: true } },
  replies: {
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      authorId: true,
      authorName: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const thread = await prisma.discussionThread.findUnique({
      where: { id },
      include: baseThreadInclude,
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, error: "Thread not found" },
        { status: 404 },
      );
    }

    const latest =
      thread.replies.length > 0
        ? thread.replies[thread.replies.length - 1]
        : null;
    const serialized = serializeThread(thread, latest);
    const replies = thread.replies.map((reply) => ({
      id: reply.id,
      authorId: reply.authorId,
      authorName: reply.authorName,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      updatedAt: reply.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: { ...serialized, replies },
    });
  } catch (error) {
    console.error("Failed to load discussion thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve thread" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.userType !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const { title, content } = await req.json();
    const updated = await prisma.discussionThread.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(typeof content !== "undefined" ? { content } : {}),
      },
      include: {
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeThread(updated),
    });
  } catch (error) {
    console.error("Failed to update discussion thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update thread" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.userType !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    await prisma.discussionThread.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete discussion thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete thread" },
      { status: 500 },
    );
  }
}
