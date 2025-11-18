import type { DiscussionReply, DiscussionThread } from "@prisma/client";

export type ThreadWithMeta = DiscussionThread & {
  _count: { replies: number };
};

export type ReplyPreview = Pick<
  DiscussionReply,
  "authorName" | "content" | "createdAt"
>;

export type SerializedThread = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  lastReplyAt: string;
  lastReplyBy: string;
  lastReplyPreview: string;
};

const truncate = (value: string, max = 160) =>
  value.length > max ? `${value.slice(0, max - 1)}…` : value;

export const serializeThread = (
  thread: ThreadWithMeta,
  latestReply?: ReplyPreview | null,
): SerializedThread => {
  const lastReply = latestReply ?? null;
  const fallbackPreview = thread.content ?? "";
  const lastReplyDate = lastReply?.createdAt ?? thread.updatedAt;

  return {
    id: thread.id,
    title: thread.title,
    authorId: thread.authorId,
    authorName: thread.authorName,
    content: thread.content ?? null,
    createdAt: thread.createdAt.toISOString(),
    updatedAt: thread.updatedAt.toISOString(),
    replyCount: thread._count.replies,
    lastReplyAt: lastReplyDate.toISOString(),
    lastReplyBy: lastReply?.authorName ?? thread.authorName,
    lastReplyPreview: truncate(
      lastReply?.content ?? fallbackPreview ?? "",
      180,
    ),
  };
};
