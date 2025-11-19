import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react";
import { DiscussionRepliesClient } from "@/components/tutorial/DiscussionRepliesClient";
import type { DiscussionThreadDetailDTO } from "@/types/discussion";

const formatFullDate = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

const buildBaseUrl = async () => {
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  return `${protocol}://${host}`;
};

const fetchThread = async (id: string): Promise<DiscussionThreadDetailDTO | null> => {
  const baseUrl = await buildBaseUrl();
  const res = await fetch(`${baseUrl}/api/discussion/threads/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch discussion thread");
  }

  const payload = await res.json();
  return payload?.data ?? null;
};

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = await fetchThread(id);

  if (!thread) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] via-white to-[#F8FAFC] dark:from-[#050513] dark:via-[#06081C] dark:to-[#0a0c1d]">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <Link
          href="/tutorial#diskusi"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#06B6D4] hover:text-[#0ea5e9] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Tutorial
        </Link>

        <section className="rounded-3xl border border-[#06B6D4]/15 bg-white/90 p-8 backdrop-blur dark:bg-slate-900/70 dark:border-white/10 shadow-lg space-y-6">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <MessageSquare className="w-5 h-5 text-[#06B6D4]" />
            Diskusi Komunitas
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {thread.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {thread.authorName}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatFullDate(thread.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {thread.replyCount} balasan
              </div>
            </div>
          </div>
          {thread.content && (
            <p className="text-slate-700 dark:text-slate-200 leading-7 whitespace-pre-line">
              {thread.content}
            </p>
          )}
        </section>

        <DiscussionRepliesClient thread={thread} />
      </div>
    </div>
  );
}
