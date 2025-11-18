export interface DiscussionReplyDTO {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionThreadDetailDTO {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  lastReplyAt?: string | null;
  lastReplyBy?: string | null;
  lastReplyPreview?: string | null;
  replies: DiscussionReplyDTO[];
}
