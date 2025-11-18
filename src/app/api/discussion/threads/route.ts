import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { serializeThread } from "@/lib/discussion/serializer";
import { authOptions } from "@/lib/auth-config";

// GET: List all threads with optional search/limit
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const limitParam = Number(searchParams.get("limit"));
    const take = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), 50)
      : 20;

    const threads = await prisma.discussionThread.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: {
        updatedAt: "desc",
      },
      take,
      include: {
        _count: { select: { replies: true } },
        replies: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            authorName: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    const data = threads.map((thread) =>
      serializeThread(thread, thread.replies?.[0] ?? null),
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to list discussion threads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch discussion threads" },
      { status: 500 },
    );
  }
}

// POST: Create a new thread
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.userType !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { title, content } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 },
      );
    }

    const thread = await prisma.discussionThread.create({
      data: {
        title: title.trim(),
        content,
        authorId: session.user.id,
        authorName: session.user.name ?? "Admin GEMA",
      },
      include: {
        _count: { select: { replies: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeThread(thread),
    });
  } catch (error) {
    console.error("Failed to create discussion thread:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create thread" },
      { status: 500 },
    );
  }
}
